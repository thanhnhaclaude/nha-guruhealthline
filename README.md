# NutriVerdict

Website hướng dẫn thực phẩm bổ sung dựa trên bằng chứng. Dựng bằng **Next.js 16** (Node.js), bài viết là file **Markdown**, deploy lên **Hostinger Node.js Web App** từ GitHub.

SEO tuân theo hai nguồn:
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=vi): nội dung gốc; title và description riêng cho từng trang; URL mô tả; alt text; anchor text rõ nghĩa; không nhồi nhét từ khóa; canonical.
- [Microsoft: SEO considerations](https://learn.microsoft.com/en-us/dynamics365/commerce/search-engine-optimization-considerations): noindex khi đang phát triển và khi soft launch; robots.txt và sitemap khi lên production; `X-Robots-Tag` cho domain tạm.

## Chạy trên máy

```bash
npm install
npm run dev          # http://localhost:3000
npm run check:seo    # kiểm tra SEO cho mọi bài viết
npm run build        # build production
```

## Viết bài mới

Tạo file `content/posts/<url-bai-viet>.md`. Tên file chính là URL, nên dùng chữ thường nối bằng dấu gạch ngang. Ví dụ:

```yaml
---
title: "Tiêu đề H1 hiển thị trên trang"
seoTitle: "Thẻ <title>, tối đa khoảng 60 ký tự"
description: "Meta description riêng cho bài, 70–160 ký tự."
category: dosing            # dosing | compare | ingredients
date: 2026-10-14
updated: 2026-10-14
author: editorial
primaryKeyword: tu khoa chinh
secondaryKeywords: [tu khoa phu 1, tu khoa phu 2]
answer: "Câu trả lời nhanh 2–3 câu, hiển thị đầu bài."
related: [slug-bai-lien-quan]
products:                   # hộp "Where to buy", link có rel="sponsored"
  - name: Tên dạng sản phẩm
    badge: Nhãn ngắn
    why: Lý do chọn
    query: tu khoa tim tren amazon
    store: amazon            # amazon | iherb
faq:
  - q: Câu hỏi?
    a: Câu trả lời.
sources:
  - title: Tên nguồn
    url: https://...
noindex: false              # true = publish nhưng không cho Google index
---

Nội dung Markdown. Dùng ## cho H2 (tự sinh mục lục), có hỗ trợ bảng.
```

Chạy `npm run check:seo` trước mỗi lần push.

## Ba giai đoạn lập chỉ mục (biến `SITE_STAGE`)

| Giá trị | Meta robots | Header X-Robots-Tag | robots.txt |
|---|---|---|---|
| `development` | noindex, nofollow | noindex, nofollow | không có dòng Sitemap |
| `soft-launch` | noindex, nofollow | noindex, nofollow | không có dòng Sitemap |
| `production` | index, follow | chỉ áp cho domain khác `SITE_URL` | `Allow: /` + Sitemap |

Lưu ý: không dùng `Disallow` để chặn trong giai đoạn phát triển. Nếu Google không được crawl trang thì nó cũng không đọc được thẻ noindex.

## Push lên GitHub

1. Tạo repo mới trên github.com (để Private nếu chưa muốn công khai), **không** tick "Add README".
2. Trong thư mục dự án:

```bash
git remote add origin https://github.com/<tai-khoan>/nutriverdict.git
git push -u origin main
```

## Deploy lên Hostinger (gói Business/Cloud)

1. hPanel → **Websites** → **Add website** → **Node.js Apps**.
2. Chọn **Import Git repository**, kết nối GitHub và chọn repo `nutriverdict`, nhánh `main`.
3. Cấu hình build (thường được nhận diện tự động là Next.js):
   - Node.js version: **22.x** (tối thiểu 20.9)
   - Build command: `npm run build`
   - Start command: `npm start`
   - Thư mục gốc: `/`
4. **Environment variables**: thêm `SITE_NAME`, `SITE_URL`, `SITE_STAGE`, `AMAZON_TAG`, `IHERB_RCODE` (xem `.env.example`). Lần deploy đầu nên đặt `SITE_STAGE=soft-launch`.
5. Bấm **Deploy**. Từ đó mỗi lần `git push` lên `main`, Hostinger sẽ tự build lại.
6. Gắn tên miền chính và bật SSL trong hPanel.

### Checklist trước khi chuyển sang production

- [ ] Thay "NutriVerdict Editorial Team" trong `lib/authors.js` bằng tác giả thật có chuyên môn
- [ ] Sửa email `editor@yourdomain.com` trong `content/pages/`
- [ ] Đã được duyệt Amazon Associates và điền `AMAZON_TAG`
- [ ] Bấm thử mọi link nguồn ở cuối mỗi bài
- [ ] Đổi `SITE_STAGE=production` rồi redeploy
- [ ] Kiểm tra `https://<domain>/robots.txt` và `/sitemap.xml`
- [ ] Mở domain tạm `*.hostingersite.com` và xác nhận header `X-Robots-Tag: noindex` (DevTools → Network)
- [ ] Gửi sitemap lên Google Search Console và Bing Webmaster Tools
