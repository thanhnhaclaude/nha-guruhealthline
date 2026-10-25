# GuruHealthline

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

### Các loại nội dung khác

| Thư mục | URL | Ghi chú |
|---|---|---|
| `content/posts/` | `/<slug>` | Hướng dẫn liều dùng (`category: dosing`) và so sánh (`category: compare`) |
| `content/ingredients/` | `/ingredients/<slug>` | Thêm `name`, `facts` (thông tin nhanh) và `evidence` (bảng xếp hạng bằng chứng A–D) |
| `content/reviews/` | `/reviews/<slug>` | Thêm `rating`, `scores` (5 tiêu chí), `pros`, `cons`, `goodFor`, `skipIf`, `ingredients`, `cta`. Xem file mẫu `example-*.md` |
| `lib/topics.js` | `/<chủ-đề>` | 18 mục tiêu sức khỏe; gắn bài vào chủ đề bằng `topics: [sleep, ...]` |
| `lib/tools.js` | `/tools/...` | Danh sách công cụ |

Review có `example: true` là **bản mẫu bố cục**. Chúng chỉ hiện ở development và soft-launch, tự biến mất khi `SITE_STAGE=production`. Hãy thay bằng review sản phẩm thật, và chỉ ghi những gì bạn thực sự đã kiểm tra.

Trang chủ đề chưa có bài nào sẽ tự động bị `noindex` và không nằm trong sitemap, để tránh trang mỏng.

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
git remote add origin https://github.com/<tai-khoan>/guruhealthline.git
git push -u origin main
```

## Deploy lên Hostinger (gói Business/Cloud)

1. hPanel → **Websites** → **Add website** → **Node.js Apps**.
2. Chọn **Import Git repository**, kết nối GitHub và chọn repo `guruhealthline`, nhánh `main`.
3. Cấu hình build (thường được nhận diện tự động là Next.js):
   - Node.js version: **22.x** (tối thiểu 20.9)
   - Build command: `npm run build`
   - Start command: `npm start`
   - Thư mục gốc: `/`
4. **Environment variables**: thêm `SITE_NAME`, `SITE_URL`, `SITE_STAGE`, `AMAZON_TAG`, `IHERB_RCODE` (xem `.env.example`). Lần deploy đầu nên đặt `SITE_STAGE=soft-launch`.
5. Bấm **Deploy**. Từ đó mỗi lần `git push` lên `main`, Hostinger sẽ tự build lại.
6. Gắn tên miền chính và bật SSL trong hPanel.

### Checklist trước khi chuyển sang production

- [ ] Thay "GuruHealthline Editorial Team" trong `lib/authors.js` bằng tác giả thật có chuyên môn
- [ ] Sửa email `editor@guruhealthline.com` trong `content/pages/`
- [ ] Đã được duyệt Amazon Associates và điền `AMAZON_TAG`
- [ ] Bấm thử mọi link nguồn ở cuối mỗi bài
- [ ] Đổi `SITE_STAGE=production` rồi redeploy
- [ ] Kiểm tra `https://<domain>/robots.txt` và `/sitemap.xml`
- [ ] Mở domain tạm `*.hostingersite.com` và xác nhận header `X-Robots-Tag: noindex` (DevTools → Network)
- [ ] Gửi sitemap lên Google Search Console và Bing Webmaster Tools

## Cửa hàng (dropship Supliful, thanh toán Stripe + PayPal)

Đường dẫn: `/shop/` (danh mục), `/shop/<sản-phẩm>/`, `/cart/`, `/checkout/success/`, `/admin/` (quản trị).

**Luồng đơn hàng:** khách thêm vào giỏ → trả bằng thẻ (Stripe Checkout) hoặc PayPal → server tính lại giá từ catalog, lưu đơn vào MySQL → khi thanh toán xác nhận (webhook Stripe / capture PayPal): gửi email xác nhận cho khách, email báo đơn cho chủ shop, và gửi đơn sang Supliful qua Shopify (nếu đã kết nối) → Supliful giao hàng → webhook Shopify cập nhật mã vận đơn và email cho khách.

**Sản phẩm** nằm trong `content/products/*.md`: 22 sản phẩm thật trong danh mục Supliful (trường `supliful` = slug trên supliful.com/catalog), bảng Supplement Facts chép từ nhãn Supliful ngày 25/10/2026, giá bán lẻ là giá đề xuất — kiểm tra lại với giá vốn Supliful. Giá, bật/tắt và Shopify variant ID chỉnh ở `/admin/products/`. Các file có `sample: true` là sản phẩm mẫu: không được index và **không bán được khi dùng khóa live**. Khi có sản phẩm thật: điền `size`, `servings`, giá, `shopifyVariantId`, rồi xóa dòng `sample: true`.

### Cài đặt trên Hostinger (biến môi trường, xem `.env.example`)

1. **MySQL:** hPanel → Databases → tạo database + user → `DATABASE_URL=mysql://USER:PASS@HOST:3306/DB`. Bảng được tạo tự động.
2. **Stripe:** Developers → API keys → `STRIPE_SECRET_KEY`. Webhooks → Add endpoint `https://guruhealthline.com/api/webhooks/stripe/` (giữ dấu `/` cuối), sự kiện `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded` → `STRIPE_WEBHOOK_SECRET`.
3. **PayPal:** developer.paypal.com → Apps & Credentials → `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV=sandbox` (thử) hoặc `live`.
4. **Email:** tạo hộp thư `orders@guruhealthline.com` trên Hostinger → `SMTP_USER`, `SMTP_PASS`, `ORDER_NOTIFY_EMAIL` (email nhận báo đơn).
5. **Admin:** `ADMIN_PASSWORD` (≥ 12 ký tự), `ADMIN_SESSION_SECRET` (chuỗi ngẫu nhiên dài).
6. **Supliful tự động (tùy chọn):** cần Supliful Pro + một store Shopify chạy ngầm (khách không thấy). Cài app Supliful, *Publish to Shopify*, bật *Automatically fulfill*, tạo custom app với quyền orders/products/customers/fulfillments → `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_TOKEN`. Webhook Shopify (Fulfillment creation/update, Order cancellation) → `https://guruhealthline.com/api/webhooks/shopify/`, secret → `SHOPIFY_WEBHOOK_SECRET`. Copy variant ID từng sản phẩm vào `/admin/products/`. Chưa có Shopify thì đơn được email về để đặt thủ công trên Supliful.

Thử toàn bộ với khóa test (Stripe `sk_test_…`, PayPal sandbox) trước khi đổi sang live.

### Chạy thử trên máy

```bash
npm run dev:db   # MySQL tạm, in ra DATABASE_URL cho .env.local
npm run dev
```
