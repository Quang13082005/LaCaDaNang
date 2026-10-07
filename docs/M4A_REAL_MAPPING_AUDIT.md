# M4-A — REAL DATA MAPPING AUDIT
Audit time (Neon): 2026-10-07T05:36:36.181Z. Database: neondb. HEAD `e39c7de65fc413f6561e0069642ba58f6bb95f0e`, branch `phase-2a-deploy`.

Scope: SELECT-only audit; no API/frontend/backend/schema/data changes, no commit/push/deploy. M3-A/M3-B retained. Existing16 staged renames,15 modified files,7 untracked files preserved.

## Method / evidence
Eligibility E = places.active=TRUE AND business_status=OPERATIONAL. Tag matches additionally require tags.active=TRUE. Counts use distinct place IDs within the same section. Coverage = tag matches / eligible section count, rounded2 decimals. SAFE means >=3 available records only, not quality/semantic approval; LIMITED=2, WEAK=1, UNSUPPORTED=0. Stored subjective tags evidence association, not independent truth/freshness certification.
All DB statements start SELECT; no SET/BEGIN/import/mutation. Eight initial SELECTs plus11 parameterized mapping SELECTs; no writes. Queries, timestamps, complete selected rows and results in `D:/Dự án tìm địa điểm ăn chơi/M4A_EVIDENCE_2026-10-07/neon-audit.json` and `mapping-queries.json`; reproducible audit.cjs/mapping.cjs alongside. Credentials never printed. Reads are successive SELECT snapshots, not a claimed atomic transaction. Coverage independently recalculated from fetched relations and matched SQL.
Tables read: places,place_tags,tags,tag_translations,place_translations and administrative_units. Frontend source is used only to identify existing UI labels, never to establish Neon facts.

## CAFE AUDIT
Total/active/OPERATIONAL/eligible: 145/145/145/145. Unique linked active tags: 2. All eligible places have at least one active tag.
Primary-type distribution: `bar`=1, `cafe`=137, `coffee_shop`=4, `establishment`=3.
Translation vi: 145/145 rows; blank display_name=0, generic type label=4, null description=145.
Translation en: 145/145 rows; blank display_name=0, generic type label=4, null description=145.
Translation ko: 145/145 rows; blank display_name=0, generic type label=4, null description=145.
No CAFE intent or preferences currently exist in PRIMARY_INTENTS/PREFERENCES_BY_INTENT or Home intent union. Only CAFE145 and POPULAR4 occur; QUIET/DATE/FAMILY/GROUP/NIGHT/BEACH/PHOTO all0. Generic no-filter dataset is available145, but adding UI requires a separate product decision; no new chip proposed here.

## GO AUDIT
Total/active/OPERATIONAL/eligible: 94/94/94/94. Unique linked active tags: 20. All eligible places have at least one active tag.
Primary-type distribution: `amusement_park`=2, `bar`=9, `bar_and_grill`=1, `bridge`=25, `buddhist_temple`=2, `church`=4, `community_center`=2, `establishment`=2, `historical_landmark`=2, `museum`=2, `park`=4, `place_of_worship`=1, `tourist_attraction`=36, `water_park`=2.
Translation vi: 94/94 rows; blank display_name=0, generic type label=33, null description=94.
Translation en: 94/94 rows; blank display_name=0, generic type label=2, null description=94.
Translation ko: 94/94 rows; blank display_name=0, generic type label=33, null description=94.
Contains attractions/bridges, bars, parks, religious sites, amusement/water parks, museums and community centers. Do not narrow to beaches or assume NIGHT means open now.

## STAY AUDIT
Total/active/OPERATIONAL/eligible: 127/127/127/127. Unique linked active tags: 16. All eligible places have at least one active tag.
Primary-type distribution: `campground`=3, `camping_cabin`=1, `cottage`=1, `establishment`=3, `extended_stay_hotel`=3, `farmstay`=1, `hostel`=4, `hotel`=66, `lodging`=8, `motel`=4, `private_guest_room`=12, `resort_hotel`=21.
Translation vi: 127/127 rows; blank display_name=0, generic type label=21, null description=127.
Translation en: 127/127 rows; blank display_name=0, generic type label=3, null description=127.
Translation ko: 127/127 rows; blank display_name=0, generic type label=21, null description=127.
Contains hotels/resorts, guest rooms/homestays, lodging/motels, hostels, camps and one farmstay. Availability/prices/distances are absent from this audit and cannot be ranked or displayed as live facts.

## TAG COVERAGE
All36 registered tags below, including0 usage in these sections. All36 tags active; all have vi/en/ko labels (108 translation rows). BUDGET is absent from catalog (not merely unused).

| CODE | DOMAIN | vi | en | ko | CAFE n/% | GO n/% | STAY n/% |
|---|---|---|---|---|---|---|---|
| ATTRACTION | GO | Điểm tham quan | Attraction | 관광 명소 | 0 / 0.00% | 62 / 65.96% | 0 / 0.00% |
| BAKERY | EAT | Tiệm bánh | Bakery | 베이커리 | 0 / 0.00% | 0 / 0.00% | 0 / 0.00% |
| BAR | GO | Bar / bia | Bar / Beer | 바 / 비어 | 0 / 0.00% | 9 / 9.57% | 0 / 0.00% |
| BEACH | COMMON | Biển | Beach | 해변 | 0 / 0.00% | 3 / 3.19% | 0 / 0.00% |
| CAFE | CAFE | Cà phê | Cafe | 카페 | 145 / 100.00% | 0 / 0.00% | 0 / 0.00% |
| CAMPING | STAY | Cắm trại | Camping | 캠핑 | 0 / 0.00% | 0 / 0.00% | 4 / 3.15% |
| CENTRAL | COMMON | Trung tâm | Central | 중심가 | 0 / 0.00% | 0 / 0.00% | 16 / 12.60% |
| CULTURAL_CENTER | GO | Nhà văn hóa | Cultural center | 문화 센터 | 0 / 0.00% | 2 / 2.13% | 0 / 0.00% |
| DATE | COMMON | Hẹn hò | Date | 데이트 | 0 / 0.00% | 10 / 10.64% | 10 / 7.87% |
| ENTERTAINMENT | GO | Vui chơi | Entertainment | 엔터테인먼트 | 0 / 0.00% | 8 / 8.51% | 0 / 0.00% |
| FAMILY | COMMON | Gia đình | Family | 가족 | 0 / 0.00% | 17 / 18.09% | 22 / 17.32% |
| FARMSTAY | STAY | Farmstay | Farmstay | 팜스테이 | 0 / 0.00% | 0 / 0.00% | 1 / 0.79% |
| FOOD_DRINK | EAT | Ăn uống | Food & Drink | 음식 / 음료 | 0 / 0.00% | 0 / 0.00% | 0 / 0.00% |
| GROUP | COMMON | Đi nhóm | Group | 단체 | 0 / 0.00% | 17 / 18.09% | 11 / 8.66% |
| HOMESTAY | STAY | Homestay | Homestay | 홈스테이 | 0 / 0.00% | 0 / 0.00% | 11 / 8.66% |
| HOSTEL | STAY | Hostel | Hostel | 호스텔 | 0 / 0.00% | 0 / 0.00% | 4 / 3.15% |
| HOTEL | STAY | Khách sạn | Hotel | 호텔 | 0 / 0.00% | 0 / 0.00% | 73 / 57.48% |
| LANDMARK | GO | Địa danh / di tích | Landmark | 랜드마크 | 0 / 0.00% | 5 / 5.32% | 0 / 0.00% |
| LIVELY | COMMON | Nhộn nhịp | Lively | 활기찬 | 0 / 0.00% | 3 / 3.19% | 0 / 0.00% |
| LOCAL_FOOD | EAT | Đồ ăn địa phương | Local food | 현지 음식 | 0 / 0.00% | 0 / 0.00% | 0 / 0.00% |
| LODGING | STAY | Lưu trú | Lodging | 숙박 | 0 / 0.00% | 0 / 0.00% | 13 / 10.24% |
| MUSEUM | GO | Bảo tàng | Museum | 박물관 | 0 / 0.00% | 2 / 2.13% | 0 / 0.00% |
| NATURE | COMMON | Thiên nhiên | Nature | 자연 | 0 / 0.00% | 26 / 27.66% | 1 / 0.79% |
| NEAR_BEACH | COMMON | Gần biển | Near beach | 해변 근처 | 0 / 0.00% | 2 / 2.13% | 19 / 14.96% |
| NIGHT | COMMON | Đi đêm | Night | 야간 | 0 / 0.00% | 6 / 6.38% | 0 / 0.00% |
| PARK | GO | Công viên | Park | 공원 | 0 / 0.00% | 4 / 4.26% | 0 / 0.00% |
| PHOTO | COMMON | Chụp ảnh | Photo | 사진 | 0 / 0.00% | 16 / 17.02% | 0 / 0.00% |
| POPULAR | COMMON | Phổ biến | Popular | 인기 | 4 / 2.76% | 7 / 7.45% | 41 / 32.28% |
| QUIET | COMMON | Yên tĩnh | Quiet | 조용한 | 0 / 0.00% | 8 / 8.51% | 8 / 6.30% |
| RELIGIOUS_SITE | GO | Điểm tâm linh | Religious site | 종교 명소 | 0 / 0.00% | 7 / 7.45% | 0 / 0.00% |
| RESORT | STAY | Khu nghỉ dưỡng | Resort | 리조트 | 0 / 0.00% | 0 / 0.00% | 21 / 16.54% |
| RESTAURANT | EAT | Nhà hàng / quán ăn | Restaurant | 음식점 | 0 / 0.00% | 0 / 0.00% | 0 / 0.00% |
| SCENIC | COMMON | Cảnh đẹp | Scenic | 경치 좋은 | 0 / 0.00% | 19 / 20.21% | 4 / 3.15% |
| SEAFOOD | EAT | Hải sản | Seafood | 해산물 | 0 / 0.00% | 0 / 0.00% | 0 / 0.00% |
| SOLO | COMMON | Đi một mình | Solo | 혼자 | 0 / 0.00% | 0 / 0.00% | 0 / 0.00% |
| SPECIALTY | EAT | Đặc sản | Specialty | 특산물 | 0 / 0.00% | 0 / 0.00% | 0 / 0.00% |

### Real samples for every linked discovery tag
Up to3 actual eligible records per section/tag, chosen by ascending id for transparent sampling (not a ranking recommendation). Every sample inherits the stated section/tag; no tag inferred from name. Full memberships are reproducible from place_tags evidence.

| SECTION | TAG | ID | NAME | ADMIN UNIT | RATING | REVIEWS |
|---|---|---|---|---|---|---|
| CAFE | CAFE | 16 | Pi Tây Bắc Coffee & Tea | 2 — Hòa Cường | 4.70 | 518 |
| CAFE | CAFE | 21 | Cà phê muối Chị Phương | 3 — Thanh Khê | 5.00 | 142 |
| CAFE | CAFE | 22 | Tiệm Cà Phê La Cà | 3 — Thanh Khê | 4.90 | 136 |
| CAFE | POPULAR | 66 | Starbucks Ba Na Main Gate | 8 — Hòa Khánh | 5.00 | 1726 |
| CAFE | POPULAR | 177 | Silent Cafe & Food | 22 — Hội An Đông | 5.00 | 1365 |
| CAFE | POPULAR | 188 | XLIII Specialty Coffee | 23 — Hội An Tây | 5.00 | 3454 |
| GO | ATTRACTION | 81 | Cudecamping offcial | 9 — Hải Vân | 4.80 | 82 |
| GO | ATTRACTION | 82 | Leaf Village & Farm - Làng Lá | 9 — Hải Vân | 4.70 | 3461 |
| GO | ATTRACTION | 84 | Suối Lương - Hai Van Park | 9 — Hải Vân | 3.90 | 1638 |
| GO | BAR | 5 | New Phương Đông Club | 1 — Hải Châu | 4.30 | 2309 |
| GO | BAR | 14 | Gu Quán - Nhậu Chill Đà Nẵng | 2 — Hòa Cường | 4.90 | 1299 |
| GO | BAR | 35 | Malibu Beach Club - Seaside Chill & Cocktails | 5 — An Hải | 4.80 | 2397 |
| GO | BEACH | 38 | Công viên Biển Đông (East Sea Park) | 5 — An Hải | 4.60 | 2379 |
| GO | BEACH | 150 | Blush Beach Club | 18 — Điện Bàn Đông | 4.50 | 540 |
| GO | BEACH | 230 | Biển Rạng-Núi Thành-Quảng nam | 27 — Núi Thành | 4.70 | 239 |
| GO | CULTURAL_CENTER | 276 | Nhà Văn Hoá Thôn 1 | 39 — Trà Liên | 5.00 | 1 |
| GO | CULTURAL_CENTER | 282 | Nhà Văn Hóa, thôn Thăng Phương | 41 — Trà Tân | NULL | NULL |
| GO | DATE | 84 | Suối Lương - Hai Van Park | 9 — Hải Vân | 3.90 | 1638 |
| GO | DATE | 124 | Làng bích họa Tam Thanh | 14 — Quảng Phú | 4.50 | 2321 |
| GO | DATE | 150 | Blush Beach Club | 18 — Điện Bàn Đông | 4.50 | 540 |
| GO | ENTERTAINMENT | 83 | Công Viên Nước Mikazuki 365 | 9 — Hải Vân | 4.20 | 3389 |
| GO | ENTERTAINMENT | 202 | Điểm đầu trượt thác Hoà Phú Thành | 24 — Hòa Vang | 4.50 | 40 |
| GO | ENTERTAINMENT | 203 | Hòa Phú Thành Tourist - Trượt thác Đà Nẵng | 24 — Hòa Vang | 4.40 | 2133 |
| GO | FAMILY | 38 | Công viên Biển Đông (East Sea Park) | 5 — An Hải | 4.60 | 2379 |
| GO | FAMILY | 82 | Leaf Village & Farm - Làng Lá | 9 — Hải Vân | 4.70 | 3461 |
| GO | FAMILY | 83 | Công Viên Nước Mikazuki 365 | 9 — Hải Vân | 4.20 | 3389 |
| GO | GROUP | 38 | Công viên Biển Đông (East Sea Park) | 5 — An Hải | 4.60 | 2379 |
| GO | GROUP | 83 | Công Viên Nước Mikazuki 365 | 9 — Hải Vân | 4.20 | 3389 |
| GO | GROUP | 84 | Suối Lương - Hai Van Park | 9 — Hải Vân | 3.90 | 1638 |
| GO | LANDMARK | 284 | Đập chính Thủy Điện Sông Tranh 2 | 42 — Trà Đốc | 4.40 | 65 |
| GO | LANDMARK | 296 | Cây Quế Cổ Thụ | 46 — Trà Vân | 4.30 | 4 |
| GO | LANDMARK | 297 | Cầu Đăk Buôn | 46 — Trà Vân | NULL | NULL |
| GO | LIVELY | 35 | Malibu Beach Club - Seaside Chill & Cocktails | 5 — An Hải | 4.80 | 2397 |
| GO | LIVELY | 150 | Blush Beach Club | 18 — Điện Bàn Đông | 4.50 | 540 |
| GO | LIVELY | 169 | Hair of the dog bar Hoi An | 21 — Hội An | 4.80 | 2568 |
| GO | MUSEUM | 270 | Nhà lưu niệm Cụ Huỳnh Thúc Kháng | 37 — Thạnh Bình | 4.60 | 221 |
| GO | MUSEUM | 471 | Bia Tưởng Niệm các anh hùng LS giao thông vận tải khu V | 86 — Phước Trà | 4.20 | 6 |
| GO | NATURE | 80 | Farm Bình Cơtu Hòa Bắc( Bãi Tắm - Camping ) | 9 — Hải Vân | 4.90 | 30 |
| GO | NATURE | 82 | Leaf Village & Farm - Làng Lá | 9 — Hải Vân | 4.70 | 3461 |
| GO | NATURE | 84 | Suối Lương - Hai Van Park | 9 — Hải Vân | 3.90 | 1638 |
| GO | NEAR_BEACH | 35 | Malibu Beach Club - Seaside Chill & Cocktails | 5 — An Hải | 4.80 | 2397 |
| GO | NEAR_BEACH | 150 | Blush Beach Club | 18 — Điện Bàn Đông | 4.50 | 540 |
| GO | NIGHT | 35 | Malibu Beach Club - Seaside Chill & Cocktails | 5 — An Hải | 4.80 | 2397 |
| GO | NIGHT | 82 | Leaf Village & Farm - Làng Lá | 9 — Hải Vân | 4.70 | 3461 |
| GO | NIGHT | 106 | Umi Beer Garden - Vườn Bia Kiểu Nhật | 12 — Hòa Xuân | 4.80 | 930 |
| GO | PARK | 38 | Công viên Biển Đông (East Sea Park) | 5 — An Hải | 4.60 | 2379 |
| GO | PARK | 80 | Farm Bình Cơtu Hòa Bắc( Bãi Tắm - Camping ) | 9 — Hải Vân | 4.90 | 30 |
| GO | PARK | 136 | CÔNG VIÊN ADB | 16 — Bàn Thạch | 4.40 | 53 |
| GO | PHOTO | 35 | Malibu Beach Club - Seaside Chill & Cocktails | 5 — An Hải | 4.80 | 2397 |
| GO | PHOTO | 38 | Công viên Biển Đông (East Sea Park) | 5 — An Hải | 4.60 | 2379 |
| GO | PHOTO | 49 | Chùa Linh Ứng – Sơn Trà | 6 — Sơn Trà | 4.70 | 7149 |
| GO | POPULAR | 14 | Gu Quán - Nhậu Chill Đà Nẵng | 2 — Hòa Cường | 4.90 | 1299 |
| GO | POPULAR | 35 | Malibu Beach Club - Seaside Chill & Cocktails | 5 — An Hải | 4.80 | 2397 |
| GO | POPULAR | 82 | Leaf Village & Farm - Làng Lá | 9 — Hải Vân | 4.70 | 3461 |
| GO | QUIET | 49 | Chùa Linh Ứng – Sơn Trà | 6 — Sơn Trà | 4.70 | 7149 |
| GO | QUIET | 84 | Suối Lương - Hai Van Park | 9 — Hải Vân | 3.90 | 1638 |
| GO | QUIET | 206 | Khu du lịch sinh thái Suối Hoa | 24 — Hòa Vang | 3.50 | 149 |
| GO | RELIGIOUS_SITE | 49 | Chùa Linh Ứng – Sơn Trà | 6 — Sơn Trà | 4.70 | 7149 |
| GO | RELIGIOUS_SITE | 216 | Saint Denis Church | 26 — Bà Nà | 4.70 | 95 |
| GO | RELIGIOUS_SITE | 217 | Nhà Thờ Giáo Xứ Mông Triệu | 26 — Bà Nà | 4.60 | 15 |
| GO | SCENIC | 38 | Công viên Biển Đông (East Sea Park) | 5 — An Hải | 4.60 | 2379 |
| GO | SCENIC | 49 | Chùa Linh Ứng – Sơn Trà | 6 — Sơn Trà | 4.70 | 7149 |
| GO | SCENIC | 84 | Suối Lương - Hai Van Park | 9 — Hải Vân | 3.90 | 1638 |
| STAY | CAMPING | 86 | Yên Retreat | 9 — Hải Vân | 4.50 | 496 |
| STAY | CAMPING | 87 | Tuấn Lê Glamping | 9 — Hải Vân | 4.40 | 340 |
| STAY | CAMPING | 222 | Khu du lịch sinh thái Sơn Phước | 26 — Bà Nà | 4.50 | 33 |
| STAY | CENTRAL | 6 | M Village Hotel Đà Nẵng Centre, a brand of Modern Village Lifestyle | 1 — Hải Châu | 4.90 | 1419 |
| STAY | CENTRAL | 7 | Seahorse Signature By Haviland | 1 — Hải Châu | 4.80 | 1632 |
| STAY | CENTRAL | 8 | Khách Sạn CENTRE POINT | 1 — Hải Châu | 4.80 | 795 |
| STAY | DATE | 41 | Monarque Hotel | 5 — An Hải | 4.80 | 2666 |
| STAY | DATE | 42 | Sala Danang Beach Hotel | 5 — An Hải | 4.70 | 3751 |
| STAY | DATE | 43 | Voco Ma Belle Danang | 5 — An Hải | 4.70 | 2563 |
| STAY | FAMILY | 9 | Novotel Danang Premier Han River | 1 — Hải Châu | 4.60 | 8628 |
| STAY | FAMILY | 39 | Meliá Vinpearl Danang Riverfront | 5 — An Hải | 4.90 | 17086 |
| STAY | FAMILY | 41 | Monarque Hotel | 5 — An Hải | 4.80 | 2666 |
| STAY | FARMSTAY | 442 | Dhami Farmstay - Yoga Retreat | 77 — Sông Vàng | 4.90 | 83 |
| STAY | GROUP | 9 | Novotel Danang Premier Han River | 1 — Hải Châu | 4.60 | 8628 |
| STAY | GROUP | 39 | Meliá Vinpearl Danang Riverfront | 5 — An Hải | 4.90 | 17086 |
| STAY | GROUP | 50 | InterContinental Danang Sun Peninsula Resort | 6 — Sơn Trà | 4.90 | 12500 |
| STAY | HOMESTAY | 74 | Homestay Villa Đà Nẵng - Cho thuê villa Đà Nẵng - Cho thuê villa Hội An | 8 — Hòa Khánh | 5.00 | 31 |
| STAY | HOMESTAY | 112 | Lil house - Apartment for rent in Da Nang city | 12 — Hòa Xuân | 4.80 | 12 |
| STAY | HOMESTAY | 125 | Mi Casa Beachfront | 14 — Quảng Phú | 5.00 | 140 |
| STAY | HOSTEL | 151 | Nhà Trọ Hoàng Gia | 18 — Điện Bàn Đông | 5.00 | 53 |
| STAY | HOSTEL | 193 | The Cuckoo's Nest Hostel and Bar | 23 — Hội An Tây | 5.00 | 1682 |
| STAY | HOSTEL | 414 | Nhà nghĩ h&T | 67 — Hà Nha | 4.60 | 5 |
| STAY | HOTEL | 7 | Seahorse Signature By Haviland | 1 — Hải Châu | 4.80 | 1632 |
| STAY | HOTEL | 8 | Khách Sạn CENTRE POINT | 1 — Hải Châu | 4.80 | 795 |
| STAY | HOTEL | 9 | Novotel Danang Premier Han River | 1 — Hải Châu | 4.60 | 8628 |
| STAY | LODGING | 6 | M Village Hotel Đà Nẵng Centre, a brand of Modern Village Lifestyle | 1 — Hải Châu | 4.90 | 1419 |
| STAY | LODGING | 76 | Nhà Nghỉ Phương Thảo 2 - 09 Nam Trân - Nhà Nghỉ giá rẻ gần Bến Xe Trung Tâm Đà Nẵng | 8 — Hòa Khánh | 4.30 | 99 |
| STAY | LODGING | 212 | Du Nhiên Farm & Villa | 25 — Hòa Tiến | 4.70 | 113 |
| STAY | NATURE | 50 | InterContinental Danang Sun Peninsula Resort | 6 — Sơn Trà | 4.90 | 12500 |
| STAY | NEAR_BEACH | 41 | Monarque Hotel | 5 — An Hải | 4.80 | 2666 |
| STAY | NEAR_BEACH | 42 | Sala Danang Beach Hotel | 5 — An Hải | 4.70 | 3751 |
| STAY | NEAR_BEACH | 43 | Voco Ma Belle Danang | 5 — An Hải | 4.70 | 2563 |
| STAY | POPULAR | 6 | M Village Hotel Đà Nẵng Centre, a brand of Modern Village Lifestyle | 1 — Hải Châu | 4.90 | 1419 |
| STAY | POPULAR | 7 | Seahorse Signature By Haviland | 1 — Hải Châu | 4.80 | 1632 |
| STAY | POPULAR | 9 | Novotel Danang Premier Han River | 1 — Hải Châu | 4.60 | 8628 |
| STAY | QUIET | 50 | InterContinental Danang Sun Peninsula Resort | 6 — Sơn Trà | 4.90 | 12500 |
| STAY | QUIET | 126 | TAM THANH BEACH RESORT & SPA | 14 — Quảng Phú | 4.40 | 546 |
| STAY | QUIET | 173 | RiverTown Hoi An Resort & Spa | 21 — Hội An | 4.80 | 2891 |
| STAY | RESORT | 50 | InterContinental Danang Sun Peninsula Resort | 6 — Sơn Trà | 4.90 | 12500 |
| STAY | RESORT | 61 | Pullman Danang Beach Resort | 7 — Ngũ Hành Sơn | 4.70 | 4430 |
| STAY | RESORT | 63 | Furama Resort Danang | 7 — Ngũ Hành Sơn | 4.50 | 6456 |
| STAY | SCENIC | 9 | Novotel Danang Premier Han River | 1 — Hải Châu | 4.60 | 8628 |
| STAY | SCENIC | 173 | RiverTown Hoi An Resort & Spa | 21 — Hội An | 4.80 | 2891 |
| STAY | SCENIC | 175 | Hoi An Memories Resort & Spa | 21 — Hội An | 4.70 | 2446 |

### Low-coverage tags (not invented UI mappings)
- GO/CULTURAL_CENTER: 2, LIMITED. No padding/cross-section substitution.
- GO/MUSEUM: 2, LIMITED. No padding/cross-section substitution.
- GO/NEAR_BEACH: 2, LIMITED. No padding/cross-section substitution.
- STAY/FARMSTAY: 1, WEAK. No padding/cross-section substitution.
- STAY/NATURE: 1, WEAK. No padding/cross-section substitution.

## FRONTEND PREFERENCE AUDIT
Read-only sources: src/data/demo-places.ts (PRIMARY_INTENTS and PREFERENCES_BY_INTENT), src/components/home/IntentGrid.tsx/PreferencePanel.tsx, src/app/page.tsx and src/lib/data/preference-map.ts. Current API enables EAT only. GO/STAY remain demo and have no verified backend mapping. CAFE has no intent/chip; CAFE in API type union is not a working frontend flow.
Existing GO: bien_ngam_canh (Biển / ngắm cảnh), chup_anh_dep (Chụp ảnh đẹp), thien_nhien (Thiên nhiên), vui_choi (Vui chơi). Existing STAY: gan_bien (Gần biển), gan_trung_tam (Gần trung tâm), cap_doi (Cặp đôi), yen_tinh (Yên tĩnh). No new preference/tag created.

## PROPOSED MAPPINGS
Mapping classification and result availability are separate. GENERAL row for CAFE is an existing API null-preference capability candidate, not a proposed new UI chip.

| SECTION | UI PREFERENCE | DB FILTER (plus E) | MATCH COUNT | STATUS | EVIDENCE |
|---|---|---|---|---|---|
| CAFE | None exists; API null-preference candidate only | section=CAFE, no extra tag | 145 | GENERAL / SAFE count; UI decision needed | mapping general query; no chip in source |
| GO | bien_ngam_canh — Biển / ngắm cảnh | BEACH OR SCENIC (candidate) | 20 | AMBIGUOUS / SAFE count | BEACH3, SCENIC19, intersection2; slash label does not choose OR vs narrower meaning |
| GO | chup_anh_dep — Chụp ảnh đẹp | PHOTO | 16 | DIRECT / SAFE | PHOTO translation Chụp ảnh; no independent aesthetic quality claim |
| GO | thien_nhien — Thiên nhiên | NATURE | 26 | DIRECT / SAFE | exact vi label |
| GO | vui_choi — Vui chơi | ENTERTAINMENT | 8 | DIRECT / SAFE | exact vi label |
| STAY | gan_bien — Gần biển | NEAR_BEACH | 19 | DIRECT / SAFE | exact vi label; no distance claim |
| STAY | gan_trung_tam — Gần trung tâm | CENTRAL (candidate) | 16 | AMBIGUOUS / SAFE count | stored label Trung tâm is not a quantified near-center radius; user must accept meaning |
| STAY | cap_doi — Cặp đôi | DATE (candidate) | 10 | AMBIGUOUS / SAFE count | Hẹn hò is related but not identical to couple accommodation suitability |
| STAY | yen_tinh — Yên tĩnh | QUIET | 8 | DIRECT / SAFE | exact vi label |

### Candidate alternatives and count evidence
| SECTION | CANDIDATE | FILTER | COUNT | AVAILABILITY |
|---|---|---|---|---|
| CAFE | general | none | 145 | SAFE |
| GO | bien_ngam_canh:BEACH | BEACH | 3 | SAFE |
| GO | bien_ngam_canh:SCENIC | SCENIC | 19 | SAFE |
| GO | bien_ngam_canh:OR | BEACH OR SCENIC | 20 | SAFE |
| GO | chup_anh_dep | PHOTO | 16 | SAFE |
| GO | thien_nhien | NATURE | 26 | SAFE |
| GO | vui_choi | ENTERTAINMENT | 8 | SAFE |
| STAY | gan_bien | NEAR_BEACH | 19 | SAFE |
| STAY | gan_trung_tam | CENTRAL | 16 | SAFE |
| STAY | cap_doi | DATE | 10 | SAFE |
| STAY | yen_tinh | QUIET | 8 | SAFE |

## UNSUPPORTED MAPPINGS
- CAFE QUIET/DATE/FAMILY/GROUP/NIGHT/BEACH/PHOTO:0 assignments each. These are audit checks requested by user, not existing CAFE chips. Do not borrow EAT/GO/STAY assignments.
- BUDGET: no tag in catalog across any section; no price evidence or budget chip currently in the audited UI.
- STAY BEACH=0 (NEAR_BEACH19 is a distinct existing tag); STAY NIGHT/PHOTO=0. GO CENTRAL=0. No silent semantic substitutions.
- No current GO/STAY preference candidate has0 counts; ambiguity is about meaning, not lack of matching rows. None of the current candidate UI mappings has1/2 results. Raw GO CULTURAL_CENTER/MUSEUM/NEAR_BEACH have2; STAY FARMSTAY/NATURE have1.

## DATA ANOMALIES
Section rules audited against stored primary_type plus tag/domain/translation fields; no external verification and no automatic recategorization.
- ID4 CHÚ BI quán nướng: section=EAT, primary_type=bar, tags=FAMILY,GROUP,NIGHT,POPULAR,RESTAURANT. Contradicts literal bar->GO rule in stored fields; may reflect source-type/curated-section disagreement. Requires owner review, not name-based correction.
- ID56 Butcher Steak Danang | Le Quang Dao: section=EAT, primary_type=bar, tags=POPULAR,RESTAURANT. Contradicts literal bar->GO rule in stored fields; may reflect source-type/curated-section disagreement. Requires owner review, not name-based correction.
- ID108 Phong Lệ quán: section=EAT, primary_type=bar, tags=FOOD_DRINK. Contradicts literal bar->GO rule in stored fields; may reflect source-type/curated-section disagreement. Requires owner review, not name-based correction.
- ID138 Túc Tắc Tea Quảng Nam - Trần Nhân Tông, Điện Bàn: section=CAFE, primary_type=bar, tags=CAFE. Contradicts literal bar->GO rule in stored fields; may reflect source-type/curated-section disagreement. Requires owner review, not name-based correction.
- ID259 Quán Mỳ Hồng Kính: section=EAT, primary_type=cafe, tags=FOOD_DRINK. Contradicts literal cafe->CAFE rule in stored fields; may reflect source-type/curated-section disagreement. Requires owner review, not name-based correction.
- ID416 Tâm Trang Quán CS2 (nhà hàng haeven củ ): section=EAT, primary_type=cafe, tags=RESTAURANT. Contradicts literal cafe->CAFE rule in stored fields; may reflect source-type/curated-section disagreement. Requires owner review, not name-based correction.
- In target sections, the concrete conflict is CAFE ID138 (bar + CAFE tag). Additional cross-section audit finds EAT IDs4,56,108 (bar) and259,416 (cafe); reported as context, not permission to redo EAT.
- GO community_center records and CULTURAL_CENTER memberships below are assigned GO. Name-based Nhà Văn Hóa Thôn Kinonh ID461 is also GO but has tourist_attraction/ATTRACTION; catalog completeness for cultural tags cannot be inferred from name alone.
- Night-club primary_type has0 rows; names New Phương Đông Club ID5 and Malibu Beach Club ID35 have stored bar/GO. This supports those records, not a blanket guarantee for every real club.
- Hostel and Bar name ID193 remains hostel/STAY; name token alone is not a proven section anomaly.
- All featured values in CAFE/GO/STAY are false, reducing that ranking key to a tie. Missing ratings/reviews listed below, not replaced by0.
- No missing vi/en/ko translation rows among target places, but generic type labels and null descriptions remain (see section audits). Translation existence does not mean Korean human review or precise category semantics passed.

### Community evidence
- ID276 Nhà Văn Hoá Thôn 1 | GO | community_center | Trà Liên | CULTURAL_CENTER
- ID282 Nhà Văn Hóa, thôn Thăng Phương | GO | community_center | Trà Tân | CULTURAL_CENTER

## RANKING READINESS
Existing order remains featured DESC,review_count DESC NULLS LAST,rating DESC NULLS LAST,id ASC. Data supports deterministic provisional ordering; no new ranking weights implemented. Tag matching supports EXISTS filter (OR semantics for multiple codes) without duplicates; multi-tag match-score ranking would be a new product decision.

| SECTION | rating NULL | review_count NULL | featured true / false / NULL |
|---|---|---|---|
| CAFE | 2/145 (1.38%) | 2/145 (1.38%) | 0 / 145 / 0 |
| GO | 5/94 (5.32%) | 5/94 (5.32%) | 0 / 94 / 0 |
| STAY | 1/127 (0.79%) | 1/127 (0.79%) | 0 / 127 / 0 |
Nullable fields must stay NULL and sort last. Review volume is not proof of fit or quality; data has no live hours, GPS distance, travel time, live price/availability guarantees. No ranking changes in M4-A.

## RECOMMENDED M4-B SCOPE
1. Obtain explicit M4-B authorization and decisions on GO combined beach/scenic semantics, STAY near-center meaning and couples/DATE equivalence. Resolve or explicitly accept CAFE ID138 type/section conflict before enabling CAFE generally; do not edit DB under frontend authorization.
2. Implement only evidence-backed DIRECT mappings first: GO PHOTO16/NATURE26/ENTERTAINMENT8; STAY NEAR_BEACH19/QUIET8. Keep ambiguous choices disabled/unimplemented until agreed; do not substitute GENERAL for a specific unsupported preference.
3. CAFE has no existing UI: require an explicit intent/chip design decision. No invented QUIET/DATE etc. General CAFE dataset145 or POPULAR4 availability is evidence only, not authorization to create new preferences.
4. Preserve EAT, no-image model,0–3/no-padding/empty-vs-error/stale protection and exact Maps URLs; run relevant tests/live smoke/responsive/build only in implementation phase. No GPS/nearby/i18n/analytics/notifications/deploy.

## Validation / stop
Documentation/read-only audit only. No runtime test/build rerun; earlier M3-B PASS remains historical. All pre-existing unrelated file hashes and full Git index checked unchanged. Three existing handoff docs receive an additive M4-A status update after byte-preserving backups; new audit report is the only new repository file. Evidence/scripts remain outside repo. No commit created. STOP: M4-A report ready for review; M4-B NOT_STARTED.
