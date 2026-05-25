- 1 website nội bộ, deploy bằng vercel, không để api key
- Thiết kế theo dạng phân trang
- Agency là người nhập liệu vào các file trên google sheet
- Không được viết script hay có thiết kế các khả năng để nhập liệu từ frontend. Client yêu cầu họ chỉ muốn nhập ở google sheet
- Có 2 loại chương trình là Activation và AWO
- Website cần có 3 chức năng chính
- Thứ nhất là hiển thị các trương trình hiện có lấy thông tin từ bảng TotalCampains. Click vào hiển thị chi tiết theo bảng đấy. Cách trình bày thông tin giữ nguyên như cách mà frontend đang làm 
- Thứ hai là hiển thị các quán đang có trương trình Activation, lấy các thiết kế frontend, sort filter theo SchedulePage.tsx, hiển thị thêm trường tên event, link ref tới chi tiết chương trình khi nhấp vào tên event
- Thứ ba là hiển thị các quán đang có trương trình AWO, lấy phương pháp sort filter theo AWOSchedulePage.tsx, tên quán là get venue list link từ bảng TotalCampains, Link ref tới chi tiết chương trình khi nhấp vào tên event

TotalCampains:
STT	Brand	Type (Activation/AWO)	Title	BU (VD: GHCM,NO,CE,MKD)	Start Date	End Date	PC Image Link	Mobile Image Link	Venue List Link (AWO only) - Dán link không rút gọn	Content	Code

AWO:
Hiện tại đang có vấn đề

Activation:
STT	Brand	Scale	BU	Region	Outlet ID	Outlet Name	Street	District	City	Province	Link GG Maps (Không rút gọn)	Sale Rep Name	Hard Phone Contact Sale	WORKING TIME		Act	Date	Type of outlet	Update?
														Check in Time	Check out Time				
																			

