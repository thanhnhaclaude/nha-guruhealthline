# Luồng làm việc – guruhealthline.com (GuruHealthline)

| Luồng | Lệnh mở | Phụ trách | Liên quan |
|---|---|---|---|
| Nội dung | `/noi-dung` | `content/` (posts, articles, ingredients, topics, reviews, pages, products), `lib/content.js`, `lib/authors.js`, `lib/evidence.js`, `lib/topics.js` | `seo`, `cua-hang` |
| Công cụ & giao diện | `/cong-cu` | `app/` (trừ shop, cart, checkout, admin, api), `components/`, `lib/tools.js`, `lib/tooldata.js`, `lib/site.js`, `app/tools`, `app/quiz` | `seo`, `noi-dung` |
| Cửa hàng & đối tác | `/cua-hang` | `app/shop`, `app/cart`, `app/checkout`, `app/admin`, `app/api`, `lib/shop/`, `lib/affiliate.js`, `scripts/dev-db.mjs` | `cong-cu`, `noi-dung` |
| SEO & số liệu | `/seo` | Phân tích Search Console, GA4, từ khóa; đọc vị trí theo TỪNG trang. Chỉ đề xuất, việc sửa ghi sang sổ luồng phụ trách. File: `scripts/check-seo.mjs`, `reports/` | `noi-dung`, `cong-cu` |

Luồng không tự nhớ nhau; chúng nối với nhau qua sổ `docs/luong/<luồng>.md`. Nếu sổ và CLAUDE.md mâu thuẫn, CLAUDE.md là đúng.
