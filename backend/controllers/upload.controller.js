// ============================================================
// Proxy Upload — Admin frontend se file aati hai,
// backend CDN pe forward karta hai, CDN URL return karta hai.
// Browser se directly CDN pe upload karne pe CORS block hota hai,
// isliye backend proxy zaroor hai.
// ============================================================
const proxyUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const CDN_URL = process.env.CDN_UPLOAD_URL;
        if (!CDN_URL) {
            return res.status(500).json({ success: false, message: 'CDN_UPLOAD_URL not configured in .env' });
        }

        // Node.js 18+ built-in FormData + Blob — no external package needed
        const blob     = new Blob([req.file.buffer], { type: req.file.mimetype });
        const formData = new FormData();
        formData.append('file', blob, req.file.originalname);

        const cdnRes = await fetch(CDN_URL, {
            method: 'POST',
            body:   formData,
        });

        if (!cdnRes.ok) {
            const errText = await cdnRes.text();
            console.error('CDN upload failed:', errText);
            return res.status(502).json({ success: false, message: 'CDN upload failed', detail: errText });
        }

        const cdnData = await cdnRes.json();

        // CDN response: result can be object OR array
        // Object: { result: { variants: ["https://..."] }, success: true }
        // Array:  { result: [{ variants: ["https://..."] }], success: true }
        let imageUrl = null;
        if (Array.isArray(cdnData?.result)) {
            imageUrl = cdnData.result[0]?.variants?.[0] || cdnData.result[0]?.url;
        } else if (cdnData?.result?.variants) {
            imageUrl = Array.isArray(cdnData.result.variants)
                ? cdnData.result.variants[0]
                : cdnData.result.variants;
        } else if (cdnData?.url) {
            imageUrl = cdnData.url;
        }

        if (!imageUrl) {
            console.error('CDN response missing URL:', JSON.stringify(cdnData));
            return res.status(502).json({ success: false, message: 'CDN did not return an image URL' });
        }

        res.status(200).json({ success: true, url: imageUrl });

    } catch (error) {
        console.error('Proxy Upload Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = { proxyUpload };
