def optimize_image_url(url):
    """
    Injects Cloudinary auto-format and auto-quality flags into the URL if applicable.
    Expected format: https://res.cloudinary.com/.../image/upload/v1234567890/...
    Optimized format: https://res.cloudinary.com/.../image/upload/f_auto,q_auto/v1234567890/...
    """
    if not url:
        return url
    url_str = str(url)
    if 'res.cloudinary.com' in url_str and '/upload/' in url_str:
        if 'f_auto' not in url_str and 'q_auto' not in url_str:
            return url_str.replace('/upload/', '/upload/f_auto,q_auto/')
    return url_str
