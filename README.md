# Camagru

montage 可叠加图片 上传图片乱码




Common 
• a decent page layout (meaning at least a header, a main section and a footer), be able to display correctly on mobile devices and have an adapted layout on small resolutions.
• All your forms should have correct validations and the whole site should be secured.
• Store plain or unencrypted passwords in the database.
• Offer the ability to inject HTML or “user” JavaScript in badly protected variables. • Offer the ability to upload unwanted content on the server.
• Offer the possibility of altering an SQL query.
• Use an extern form to manipulate so-called private data
• 体面的页面布局（至少意味着页眉、主要部分和页脚），能够在移动设备上正确显示，并且在小分辨率下具有适应的布局。
• 您的所有表单都应该有正确的验证并且整个站点应该是安全的。
• 在数据库中存储普通或未加密的密码。
• 提供在受到严重保护的变量中注入 HTML 或“用户”JavaScript 的能力。 
• 提供在服务器上上传不需要的内容的能力。
• 提供更改 SQL 查询的可能性。
• 使用外部表单来处理所谓的私人数据
 
 


 User features
• allow a user to sign up at least a valid email address, an username a password with at least a minimum level of complexity.
•  user should confirm his account via a unique link sent at the email address 
• connect to your application, using his username and his password. 
• send a password reinitialisation mail, if he forget his password.
• disconnect in one click at any time on any page.
• Once connected, can modify his username, mail address or password.
用户特征
  至少允许用户注册有效的电子邮件地址，用户名,至少具有最低复杂性的密码。
• 用户应通过电子邮件地址发送的唯一链接确认其帐户
• 使用他的用户名和密码连接到您的应用程序。
• 如果忘记密码，发送密码重新初始化邮件。
• 在任何页面上随时一键断开连接。
• 可以修改他的用户名、邮件地址或密码。 -->

	
Gallery page
• display all the images edited by all the users
• ordered by date of creation
• It should also allow (only) a connected user to like them and/or comment them.
• When an image receives a new comment, the author of the image should be notified by email
• This preference must be set as true by default but can be deactivated in user’s preferences.
• The list of images must be paginated, with at least 5 elements per page. -->
画廊特征
• 显示所有用户编辑的所有图像
• 按创建日期排序
• 它还应该（仅）允许连接的用户喜欢他们和/或评论他们。
• 当图像收到新评论时，应通过电子邮件通知图像的作者
• 此首选项必须默认设置为 true，但可以在用户首选项中禁用。
• 图像列表必须分页，每页至少包含 5 个元素。 -->


Editing features :This part only to users that are connected 
contain 2 sections:
• A main section containing the preview of the user’s webcam, the list of superposable images and a button allowing to capture a picture.
• A side section displaying thumbnails of all previous pictures taken. 
• Superposable images must be selectable and the button allowing to take the picture should be inactive (not clickable) as long as no superposable image has been selected.
• The creation of the final image (so among others the superposing of the two images) must be  done on the server side.
• Because not everyone has a webcam, allow the upload of a user image 
.The user able to delete his edited images 
• 包含用户网络摄像头预览的主要部分、可叠加图像列表和允许捕获图片的按钮。
• 侧面部分显示所有以前拍摄的照片的缩略图.
• 可叠加图像必须是可选择的，并且只要没有选择可叠加图像，允许拍照的按钮应处于非活动状态（不可点击）。
• 最终图像的创建（其中包括两个图像的叠加）必须在服务器端完成。
• 因为不是每个人都有网络摄像头，所以允许上传用户图像
. 用户可以删除他编辑的图像 # Camagru
