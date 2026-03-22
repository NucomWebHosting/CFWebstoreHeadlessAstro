
/****** Object:  Table [dbo].[AccessKeys]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccessKeys](
	[AccessKey_ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Keyring] [nvarchar](50) NULL,
	[System] [bit] NOT NULL,
 CONSTRAINT [AccessKeys_PK] PRIMARY KEY CLUSTERED 
(
	[AccessKey_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Account]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Account](
	[Account_ID] [int] IDENTITY(1,1) NOT NULL,
	[User_ID] [int] NULL,
	[Customer_ID] [int] NOT NULL,
	[Account_Name] [nvarchar](50) NOT NULL,
	[Type1] [nvarchar](50) NOT NULL,
	[Description] [ntext] NULL,
	[Policy] [ntext] NULL,
	[Logo] [nvarchar](255) NULL,
	[Rep] [nvarchar](50) NULL,
	[Terms] [nvarchar](50) NULL,
	[LastUsed] [datetime] NULL,
	[Directory_Live] [bit] NOT NULL,
	[Web_URL] [nvarchar](75) NULL,
	[Dropship_Email] [nvarchar](100) NULL,
	[PO_Text] [nvarchar](50) NULL,
	[Map_URL] [ntext] NULL,
	[Easypost_Carrier_Account_ID] [nvarchar](100) NULL,
	[Hold_MAP] [bit] NOT NULL,
	[Sold_by_Amazon] [bit] NOT NULL,
	[Sold_by_Manufactorer_on_Amazon] [bit] NOT NULL,
	[LTSPManfID] [int] NOT NULL,
	[ID_Tag] [nvarchar](35) NULL,
 CONSTRAINT [Account_PK] PRIMARY KEY CLUSTERED 
(
	[Account_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[achData]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[achData](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[transferType] [nvarchar](250) NULL,
	[fingerprint] [nvarchar](250) NULL,
	[routingNumber] [nvarchar](250) NULL,
	[accountNumberSuffix] [int] NULL,
	[accountType] [nvarchar](250) NULL,
	[bankName] [nvarchar](250) NULL,
	[Customer_ID] [int] NULL,
	[ID_Tag] [nvarchar](35) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Admin_Menu]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Admin_Menu](
	[Menu_id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](75) NULL,
	[Link] [nvarchar](250) NULL,
	[Parent_id] [int] NOT NULL,
	[ParentIDs] [nvarchar](50) NULL,
	[ParentNames] [nvarchar](500) NULL,
	[Priority] [int] NOT NULL,
	[Permission_name] [nvarchar](45) NULL,
	[Permission] [int] NULL,
	[Tooltip] [nvarchar](500) NULL,
	[Icon] [nvarchar](100) NULL,
	[Display] [int] NOT NULL,
	[DateAdded] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Affiliates]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Affiliates](
	[Affiliate_ID] [int] IDENTITY(1,1) NOT NULL,
	[AffCode] [int] NOT NULL,
	[AffPercent] [float] NOT NULL,
	[Aff_Site] [nvarchar](255) NULL,
	[ID_Tag] [nvarchar](35) NULL,
 CONSTRAINT [Affiliates_PK] PRIMARY KEY CLUSTERED 
(
	[Affiliate_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Amazon_Department]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Amazon_Department](
	[Department_id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](150) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Amazon_Item_Type]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Amazon_Item_Type](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](150) NULL,
	[Department_id] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Amazon_Schedule]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Amazon_Schedule](
	[Schedule_ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[Time_Interval] [int] NOT NULL,
	[Start_time] [time](7) NULL,
	[URL] [nvarchar](250) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Amazon_Settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Amazon_Settings](
	[ID] [int] NULL,
	[Seller_ID] [nvarchar](50) NULL,
	[Marketplace_ID] [nvarchar](50) NULL,
	[Developer_ID] [nvarchar](50) NULL,
	[AWS_Key] [nvarchar](50) NULL,
	[Secret_Key] [nvarchar](50) NULL,
	[Nucom_Percent] [float] NULL,
	[NucomClientKey] [nvarchar](50) NULL,
	[NucomClientSecret] [nvarchar](100) NULL,
	[NucomAPIKey] [nvarchar](100) NULL,
	[CFWebstoreURL] [nvarchar](100) NULL,
	[NucomAccessToken] [nvarchar](500) NULL,
	[NucomServicesURL] [nvarchar](250) NULL,
	[Application_ID] [nvarchar](500) NULL,
	[access_token] [nvarchar](500) NULL,
	[refresh_token] [nvarchar](500) NULL,
	[lws_client_id] [nvarchar](500) NULL,
	[lws_client_secret] [nvarchar](500) NULL,
	[order_token] [nvarchar](500) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Avatax_Settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Avatax_Settings](
	[ID] [int] NOT NULL,
	[apiKey] [nvarchar](50) NULL,
	[username] [nvarchar](50) NULL,
	[password] [nvarchar](150) NULL,
	[AccountID] [nvarchar](50) NULL,
	[CustomerCode] [nvarchar](50) NULL,
	[CompanyCode] [nvarchar](100) NULL,
	[APIURL] [nvarchar](150) NULL,
	[TaxShipping] [bit] NOT NULL,
	[TaxAddress] [nvarchar](25) NULL,
	[NucomClientKey] [nvarchar](50) NULL,
	[NucomClientSecret] [nvarchar](100) NULL,
	[NucomAPIKey] [nvarchar](100) NULL,
	[CFWebstoreURL] [nvarchar](100) NULL,
	[NucomAccessToken] [nvarchar](500) NULL,
	[NucomServicesURL] [nvarchar](250) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Avatax_State]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Avatax_State](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[StateCode] [varchar](2) NULL,
	[bActive] [bit] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Blog]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Blog](
	[Blog_ID] [int] IDENTITY(1,1) NOT NULL,
	[User_ID] [int] NULL,
	[Category_id] [int] NOT NULL,
	[Name] [nvarchar](125) NOT NULL,
	[Author] [nvarchar](50) NULL,
	[Copyright] [nvarchar](50) NULL,
	[Display] [bit] NOT NULL,
	[Approved] [bit] NOT NULL,
	[Start] [datetime] NULL,
	[Expire] [datetime] NULL,
	[Priority] [int] NULL,
	[AccessKey] [int] NULL,
	[Highlight] [bit] NOT NULL,
	[Display_Title] [bit] NOT NULL,
	[Reviewable] [bit] NOT NULL,
	[Sm_Image] [nvarchar](150) NULL,
	[Sm_image_width] [int] NULL,
	[Sm_image_height] [int] NULL,
	[Lg_image_width] [int] NULL,
	[Lg_image_height] [int] NULL,
	[Short_Desc] [ntext] NULL,
	[Lg_image] [nvarchar](150) NULL,
	[Long_Desc] [ntext] NULL,
	[PassParam] [nvarchar](150) NULL,
	[Color_ID] [int] NULL,
	[Created] [datetime] NULL,
	[Metadescription] [nvarchar](255) NULL,
	[Keywords] [nvarchar](255) NULL,
	[TitleTag] [nvarchar](255) NULL,
	[Permalink] [nvarchar](1000) NULL,
	[Cloud] [nvarchar](500) NULL,
	[Views] [int] NOT NULL,
 CONSTRAINT [Blog_ID_PK] PRIMARY KEY CLUSTERED 
(
	[Blog_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Blog_Category]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Blog_Category](
	[Category_ID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NULL,
	[display] [int] NOT NULL,
	[priority] [int] NOT NULL,
 CONSTRAINT [Category_ID_PK] PRIMARY KEY CLUSTERED 
(
	[Category_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Blog_Item]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Blog_Item](
	[Blog_Item_ID] [int] IDENTITY(1,1) NOT NULL,
	[Blog_ID] [int] NOT NULL,
	[Item_ID] [int] NOT NULL,
 CONSTRAINT [Blog_Item_ID_PK] PRIMARY KEY CLUSTERED 
(
	[Blog_Item_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Blog_settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Blog_settings](
	[ID] [int] NOT NULL,
	[maxBlogs] [int] NOT NULL,
	[blog_columns] [int] NOT NULL,
	[show_cloud] [int] NOT NULL,
	[show_categories] [int] NOT NULL,
	[show_recentPosts] [int] NOT NULL,
	[show_search] [int] NOT NULL,
	[color_id] [int] NOT NULL,
	[Facebook_profile_id] [nvarchar](50) NULL,
	[Twitter_name] [nvarchar](100) NULL,
	[title] [nvarchar](250) NULL,
	[metadescription] [nvarchar](255) NULL,
	[keywords] [nvarchar](255) NULL,
	[BlogReviews] [bit] NOT NULL,
	[BlogReview_add] [int] NULL,
	[BlogReview_flag] [bit] NOT NULL,
	[BlogReview_Approve] [bit] NOT NULL,
	[Captcha] [bit] NOT NULL,
	[Listing] [varchar](100) NULL,
 CONSTRAINT [ID_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BlogReviews]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BlogReviews](
	[Review_ID] [int] IDENTITY(1,1) NOT NULL,
	[Blog_ID] [int] NOT NULL,
	[Parent_ID] [int] NULL,
	[User_ID] [int] NULL,
	[Anonymous] [bit] NOT NULL,
	[Anon_Name] [nvarchar](100) NULL,
	[Anon_Loc] [nvarchar](100) NULL,
	[Anon_Email] [nvarchar](100) NULL,
	[Editorial] [nvarchar](50) NULL,
	[Comment] [ntext] NULL,
	[Recommend] [bit] NOT NULL,
	[Posted] [datetime] NOT NULL,
	[Updated] [datetime] NULL,
	[Approved] [bit] NOT NULL,
	[NeedsCheck] [bit] NOT NULL,
 CONSTRAINT [Review_ID_PK] PRIMARY KEY CLUSTERED 
(
	[Review_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BoatCabinLayout]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BoatCabinLayout](
	[BoatCabinLayout_id] [int] NOT NULL,
	[Name] [nvarchar](150) NULL,
	[Abb] [nvarchar](50) NULL,
	[Priority] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BoatEngine]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BoatEngine](
	[BoatEngine_id] [int] NOT NULL,
	[name] [nvarchar](150) NULL,
	[abb] [nvarchar](50) NULL,
	[priority] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BoatModel]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BoatModel](
	[BoatModel_id] [int] NOT NULL,
	[name] [nvarchar](50) NULL,
	[abbreviation] [nvarchar](50) NULL,
	[priority] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[BoatRig]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BoatRig](
	[BoatRig_id] [int] NOT NULL,
	[Name] [nvarchar](150) NULL,
	[Abb] [nvarchar](50) NULL,
	[Priority] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CardData]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CardData](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Customer_ID] [int] NOT NULL,
	[CardType] [nvarchar](50) NOT NULL,
	[NameonCard] [nvarchar](150) NOT NULL,
	[CardNumber] [nvarchar](50) NOT NULL,
	[Expires] [nvarchar](50) NOT NULL,
	[EncryptedCard] [nvarchar](100) NULL,
	[ID_Tag] [nvarchar](35) NULL,
 CONSTRAINT [CardData_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CatCore]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CatCore](
	[CatCore_ID] [int] NOT NULL,
	[Catcore_Name] [nvarchar](50) NOT NULL,
	[PassParams] [nvarchar](150) NULL,
	[Template] [nvarchar](50) NOT NULL,
	[Category] [bit] NOT NULL,
	[Products] [bit] NOT NULL,
	[Features] [bit] NOT NULL,
	[Page] [bit] NOT NULL,
 CONSTRAINT [CatCore_PK] PRIMARY KEY NONCLUSTERED 
(
	[CatCore_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Categories]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categories](
	[Category_ID] [int] IDENTITY(1,1) NOT NULL,
	[Parent_ID] [int] NOT NULL,
	[CatCore_ID] [int] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Short_Desc] [ntext] NULL,
	[Long_Desc] [ntext] NULL,
	[Sm_Image] [nvarchar](100) NULL,
	[Lg_image] [nvarchar](100) NULL,
	[Lg_image_position] [int] NOT NULL,
	[Sm_image_width] [int] NULL,
	[Sm_image_height] [int] NULL,
	[Lg_image_width] [int] NULL,
	[Lg_image_height] [int] NULL,
	[Sm_Title] [nvarchar](100) NULL,
	[Lg_Title] [nvarchar](100) NULL,
	[PassParam] [nvarchar](100) NULL,
	[Page_URL] [nvarchar](500) NULL,
	[MM_tab] [bit] NOT NULL,
	[MM_width] [nvarchar](50) NULL,
	[MM_flyout_width] [nvarchar](50) NULL,
	[MM_columns] [int] NULL,
	[MM_subcats] [int] NOT NULL,
	[MM_percolumn] [nvarchar](50) NULL,
	[MM_productID] [int] NULL,
	[MM_link] [nvarchar](250) NULL,
	[MM_sm_image] [nvarchar](250) NULL,
	[MM_show_sm_image] [bit] NOT NULL,
	[MM_title] [nvarchar](250) NULL,
	[MM_short_desc] [nvarchar](4000) NULL,
	[MM_dummy_title] [nvarchar](50) NULL,
	[Listing] [nvarchar](100) NULL,
	[ProductListingStyle] [nvarchar](100) NULL,
	[Product_show_shortDesc] [int] NOT NULL,
	[Product_show_orderBox] [int] NOT NULL,
	[Product_show_Ratings] [int] NOT NULL,
	[Product_show_Icons] [int] NOT NULL,
	[Product_show_details] [int] NOT NULL,
	[Product_show_SKU] [int] NOT NULL,
	[Product_show_customFields] [int] NOT NULL,
	[Product_image_height] [nvarchar](50) NULL,
	[Product_grid_style] [nvarchar](50) NULL,
	[CategoryListingStyle] [nvarchar](100) NULL,
	[Category_image_height] [int] NOT NULL,
	[SearchHeader] [nvarchar](100) NULL,
	[SearchCriteria] [nvarchar](255) NULL,
	[Specialty_content] [nvarchar](255) NULL,
	[All_products] [int] NOT NULL,
	[Random] [bit] NOT NULL,
	[ShowCatHeader] [bit] NOT NULL,
	[ShowProdLeftColumn] [bit] NOT NULL,
	[ShowBrands] [bit] NOT NULL,
	[ShowSubCats] [bit] NOT NULL,
	[ShowSubCats_mobile] [bit] NOT NULL,
	[ShowProdFilter] [bit] NOT NULL,
	[ShowProdType] [bit] NOT NULL,
	[ShowPriceSlider] [bit] NOT NULL,
	[SubcatMenuStyle] [nvarchar](50) NULL,
	[AccessKey] [int] NULL,
	[CColumns] [int] NULL,
	[PColumns] [int] NULL,
	[Display] [bit] NOT NULL,
	[Display_Menu] [bit] NOT NULL,
	[Display_Mobile] [bit] NOT NULL,
	[ProdFirst] [bit] NOT NULL,
	[Text_position] [int] NOT NULL,
	[Gallery_position] [int] NOT NULL,
	[Priority] [int] NOT NULL,
	[Highlight] [bit] NOT NULL,
	[ParentIDs] [nvarchar](50) NULL,
	[ParentNames] [nvarchar](2000) NULL,
	[Sale] [bit] NOT NULL,
	[DateAdded] [datetime] NULL,
	[Color_ID] [int] NULL,
	[Metadescription] [nvarchar](255) NULL,
	[Keywords] [nvarchar](255) NULL,
	[TitleTag] [nvarchar](255) NULL,
	[Permalink] [nvarchar](1000) NULL,
	[LTSPCatID] [bigint] NOT NULL,
	[Custom_include] [nvarchar](255) NULL,
	[dropdownlabel] [nvarchar](100) NULL,
	[Lg_image_hide] [bit] NOT NULL,
	[Priority2] [int] NULL,
	[Custom_parentIDs] [nvarchar](500) NULL,
 CONSTRAINT [Categories_PK] PRIMARY KEY CLUSTERED 
(
	[Category_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CategoriesView]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CategoriesView](
	[CatID] [int] NOT NULL,
	[SubCat1ID] [int] NULL,
	[SubCat2ID] [int] NULL,
	[SubCat3ID] [int] NULL,
	[SubCat4ID] [int] NULL,
	[SubCat5ID] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Category_Item]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Category_Item](
	[Category_Item_ID] [int] NOT NULL,
	[Category_ID] [int] NOT NULL,
	[Item_ID] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CCProcess]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CCProcess](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[FriendlyName] [nvarchar](100) NULL,
	[CCGatewayName] [varchar](250) NULL,
	[CCServer] [nvarchar](150) NULL,
	[Transtype] [nvarchar](75) NULL,
	[Username] [nvarchar](300) NULL,
	[Password] [nvarchar](300) NULL,
	[Setting1] [nvarchar](75) NULL,
	[Setting2] [nvarchar](75) NULL,
	[Setting3] [nvarchar](75) NULL,
	[PaymentGatewayList] [nvarchar](250) NULL,
	[useApplePay] [bit] NULL,
	[useGooglePay] [bit] NULL,
	[useAfterPay] [bit] NULL,
	[Use_token] [bit] NOT NULL,
	[NucomClientKey] [nvarchar](50) NULL,
	[NucomClientSecret] [nvarchar](100) NULL,
	[NucomAPIKey] [nvarchar](100) NULL,
	[CFWebstoreURL] [nvarchar](100) NULL,
	[NucomAccessToken] [nvarchar](500) NULL,
	[NucomServicesURL] [nvarchar](250) NULL,
 CONSTRAINT [CCProcess_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Certificates]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Certificates](
	[Cert_ID] [int] IDENTITY(1,1) NOT NULL,
	[Cert_Code] [nvarchar](50) NOT NULL,
	[Cust_Name] [nvarchar](255) NULL,
	[CertAmount] [float] NOT NULL,
	[InitialAmount] [float] NULL,
	[StartDate] [datetime] NULL,
	[EndDate] [datetime] NULL,
	[DateCreated] [datetime] NULL,
	[Valid] [bit] NOT NULL,
	[Order_No] [int] NULL,
	[Setting_ID] [int] NULL,
	[Recipient] [nvarchar](250) NULL,
	[Type] [nvarchar](250) NULL,
 CONSTRAINT [Certificates_PK] PRIMARY KEY NONCLUSTERED 
(
	[Cert_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CertTransactions]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CertTransactions](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Cert_Id] [bigint] NOT NULL,
	[Cert_Code] [nvarchar](250) NULL,
	[CertAmount] [float] NULL,
	[InitialAmount] [float] NULL,
	[Action] [nvarchar](250) NULL,
	[Source] [nvarchar](250) NULL,
	[Notes] [nvarchar](1000) NULL,
	[Order_No] [bigint] NULL,
	[amount] [float] NULL,
	[enterdate] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Colors]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Colors](
	[Color_ID] [int] IDENTITY(1,1) NOT NULL,
	[Bgcolor] [nvarchar](10) NULL,
	[BgColorAlt] [nvarchar](100) NULL,
	[Bgimage] [nvarchar](250) NULL,
	[MainTitle] [nvarchar](10) NULL,
	[MainTitleFont] [nvarchar](50) NULL,
	[MainText] [nvarchar](10) NULL,
	[MainTextFont] [nvarchar](50) NULL,
	[MainLink] [nvarchar](10) NULL,
	[MainVLink] [nvarchar](10) NULL,
	[MainHLink] [nvarchar](10) NULL,
	[ButtonColor] [nvarchar](10) NULL,
	[ButtonHColor] [nvarchar](10) NULL,
	[Palette_Name] [nvarchar](50) NULL,
	[FormReq] [nvarchar](10) NULL,
	[LayoutFile] [nvarchar](50) NULL,
	[PassParam] [nvarchar](100) NULL,
	[Boxed] [int] NULL,
	[BgimageAlt] [nvarchar](200) NULL,
	[Colortheme] [nvarchar](100) NULL,
	[MenuColor] [nvarchar](45) NULL,
	[MenuBgColor] [nvarchar](45) NULL,
	[MenuABgColor] [nvarchar](45) NULL,
	[MenuTSize] [int] NULL,
	[MenuTColor] [nvarchar](45) NULL,
	[MenuTHColor] [nvarchar](45) NULL,
	[TopBar_Display] [bit] NOT NULL,
	[TopBar_text_color] [nvarchar](10) NULL,
	[TopBar_bg_color] [nvarchar](10) NULL,
	[TopBar_Features] [nvarchar](50) NULL,
	[TopBar_Scroller] [int] NOT NULL,
	[TopBar_Scroller_Speed] [int] NOT NULL,
	[Topbar_Mobile_Message] [nvarchar](100) NULL,
	[TopBar_Text1] [nvarchar](1000) NULL,
	[TopBar_Text2] [nvarchar](1000) NULL,
	[TopBar_Text3] [nvarchar](1000) NULL,
	[Header_style] [int] NOT NULL,
	[header_bg_color] [varchar](10) NULL,
	[header_text_color] [tinyint] NOT NULL,
	[Header_mobile_style] [int] NOT NULL,
	[Header_icon_style] [int] NOT NULL,
	[Header_icon_phone] [int] NOT NULL,
	[Header_icon_email] [int] NOT NULL,
	[Header_icon_marker] [int] NOT NULL,
	[Header_icon_cart] [int] NOT NULL,
	[Header_icon_search] [int] NOT NULL,
	[Header_icon_navigation] [int] NOT NULL,
	[Header_icon_user] [int] NOT NULL,
	[Header_icon_wishlist] [int] NOT NULL,
	[Header_icon_gift] [int] NOT NULL,
	[Header_icon_color] [nvarchar](10) NULL,
	[FooterBgColor] [nvarchar](10) NULL,
	[FooterColor] [nvarchar](10) NULL,
	[FooterTColor] [int] NULL,
	[FooterHColor] [nvarchar](10) NULL,
	[SubFooterColor] [nvarchar](10) NULL,
	[SubFooterBgColor] [nvarchar](10) NULL,
	[SubFooterTColor] [int] NULL,
	[SubFooterHColor] [nvarchar](10) NULL,
	[MenuStyle] [int] NOT NULL,
	[MM_show_home] [int] NOT NULL,
	[MM_uppercase] [int] NOT NULL,
	[MM_levels] [int] NOT NULL,
	[MM_menu_alignment] [int] NOT NULL,
	[MM_Show_Caret] [tinyint] NOT NULL,
 CONSTRAINT [Colors_PK] PRIMARY KEY CLUSTERED 
(
	[Color_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ConstantContact_settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ConstantContact_settings](
	[ID] [int] NOT NULL,
	[Username] [nvarchar](50) NULL,
	[Password] [nvarchar](250) NULL,
	[APIKey] [nvarchar](250) NULL,
	[ServiceUrl] [nvarchar](400) NULL,
	[ListID] [nvarchar](400) NULL,
	[client_secret] [nvarchar](250) NULL,
	[access_token] [nvarchar](250) NULL,
	[refresh_token] [nvarchar](250) NULL,
	[scheduled] [bit] NULL,
	[Signup_Form_URL] [nvarchar](250) NULL,
	[Signup_Form_Embed] [nvarchar](4000) NULL,
	[NucomServicesURL] [nvarchar](250) NULL,
	[nucomClientkey] [nvarchar](250) NULL,
	[nucomClientSecret] [nvarchar](250) NULL,
	[nucomApiKey] [nvarchar](250) NULL,
	[CFWebstoreUrl] [nvarchar](250) NULL,
	[nucomAccessToken] [nvarchar](250) NULL,
	[error] [ntext] NULL,
	[Subscribe_guests] [bit] NOT NULL,
 CONSTRAINT [ConstantContact_settings_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ContactForms]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ContactForms](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[SettingID] [int] NULL,
	[Form_name] [nvarchar](255) NOT NULL,
	[Form_URL] [nvarchar](500) NOT NULL,
	[ToEmail] [nvarchar](255) NOT NULL,
	[FromEmail] [nvarchar](255) NOT NULL,
	[Subject] [nvarchar](255) NOT NULL,
	[Message] [nvarchar](max) NULL,
	[FirstName] [nvarchar](100) NULL,
	[LastName] [nvarchar](100) NULL,
	[Company] [nvarchar](255) NULL,
	[Phone] [nvarchar](50) NULL,
	[Attachment] [nvarchar](500) NULL,
	[Status] [nvarchar](50) NOT NULL,
	[ReadStatus] [bit] NOT NULL,
	[DateCreated] [datetime] NULL,
	[DateLastUpdated] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Conversion_file_job]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Conversion_file_job](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[jobId] [varchar](100) NULL,
	[fileName] [varchar](100) NULL,
	[directory] [varchar](150) NULL,
	[outFile] [varchar](150) NULL,
	[jobStatus] [varchar](50) NULL,
	[email] [varchar](50) NULL,
	[jobRunTime] [datetime] NULL,
	[jobEndTime] [datetime] NULL,
	[sendEmail] [tinyint] NOT NULL,
	[error] [text] NULL,
	[ieType] [varchar](50) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Counties]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Counties](
	[County_ID] [int] IDENTITY(1,1) NOT NULL,
	[Code_ID] [int] NOT NULL,
	[State] [nvarchar](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[TaxRate] [float] NOT NULL,
	[TaxShip] [bit] NOT NULL,
 CONSTRAINT [Counties_PK] PRIMARY KEY CLUSTERED 
(
	[County_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Countries]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Countries](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Abbrev] [nvarchar](2) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[AllowUPS] [bit] NOT NULL,
	[Shipping] [int] NOT NULL,
	[AddShipAmount] [float] NOT NULL,
	[Display] [tinyint] NOT NULL,
 CONSTRAINT [Countries_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CountryTax]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CountryTax](
	[Tax_ID] [int] IDENTITY(1,1) NOT NULL,
	[Code_ID] [int] NOT NULL,
	[Country_ID] [int] NOT NULL,
	[TaxRate] [float] NOT NULL,
	[TaxShip] [bit] NOT NULL,
 CONSTRAINT [CountryTax_PK] PRIMARY KEY CLUSTERED 
(
	[Tax_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CreditCards]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CreditCards](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[CardName] [nvarchar](50) NOT NULL,
	[Used] [bit] NOT NULL,
 CONSTRAINT [CreditCards_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Currency]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Currency](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Country] [nvarchar](100) NULL,
	[Name] [nvarchar](50) NULL,
	[Code] [nvarchar](50) NULL,
	[Locale] [nvarchar](50) NULL,
	[Used] [tinyint] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Customers]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customers](
	[Customer_ID] [int] IDENTITY(1,1) NOT NULL,
	[User_ID] [int] NOT NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[LastName] [nvarchar](150) NOT NULL,
	[Company] [nvarchar](150) NULL,
	[Address1] [nvarchar](150) NOT NULL,
	[Address2] [nvarchar](150) NULL,
	[City] [nvarchar](150) NOT NULL,
	[County] [nvarchar](50) NULL,
	[State] [nvarchar](50) NOT NULL,
	[State2] [nvarchar](50) NULL,
	[Zip] [nvarchar](50) NOT NULL,
	[Country] [nvarchar](50) NOT NULL,
	[Phone] [nvarchar](150) NULL,
	[Phone2] [nvarchar](150) NULL,
	[Fax] [nvarchar](50) NULL,
	[Email] [nvarchar](150) NULL,
	[Residence] [bit] NOT NULL,
	[QB_Customer_ID] [int] NULL,
	[Customer_shipping_account] [nvarchar](50) NULL,
	[Customer_shipper] [nvarchar](50) NULL,
	[TaxID] [nvarchar](50) NULL,
	[created] [datetime] NULL,
	[LastUsed] [datetime] NULL,
	[ID_Tag] [nvarchar](35) NULL,
	[BoatModel] [nvarchar](50) NULL,
	[BoatYear] [nvarchar](50) NULL,
	[SailNo] [nvarchar](50) NULL,
	[RigSprit] [nvarchar](50) NULL,
	[TradDine] [nvarchar](50) NULL,
	[Engine] [nvarchar](50) NULL,
 CONSTRAINT [Customers_PK] PRIMARY KEY CLUSTERED 
(
	[Customer_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Customers_Boat]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Customers_Boat](
	[boat_id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[BoatModel] [nvarchar](50) NULL,
	[BoatYear] [nvarchar](50) NULL,
	[SailNo] [nvarchar](50) NULL,
	[RigSprit] [nvarchar](50) NULL,
	[TradDine] [nvarchar](50) NULL,
	[Engine] [nvarchar](50) NULL,
	[Dateadded] [datetime] NULL,
 CONSTRAINT [PK_Customers_Boat] PRIMARY KEY CLUSTERED 
(
	[boat_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CustomMethods]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CustomMethods](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](150) NULL,
	[Amount] [float] NOT NULL,
	[Used] [bit] NOT NULL,
	[Priority] [int] NULL,
	[Domestic] [bit] NOT NULL,
	[International] [bit] NOT NULL,
	[MethodHand] [float] NOT NULL,
	[MethodWeight] [float] NOT NULL,
 CONSTRAINT [CustomMethods_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CustomShipSettings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CustomShipSettings](
	[Setting_ID] [int] IDENTITY(1,1) NOT NULL,
	[ShowShipTable] [bit] NOT NULL,
	[MultPerItem] [bit] NOT NULL,
	[CumulativeAmounts] [bit] NOT NULL,
	[MultMethods] [bit] NOT NULL,
	[Debug] [bit] NOT NULL,
 CONSTRAINT [CustomShipSettings_PK] PRIMARY KEY CLUSTERED 
(
	[Setting_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Dealer]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Dealer](
	[Dealer_ID] [int] IDENTITY(1,1) NOT NULL,
	[Account_id] [int] NOT NULL,
	[User_id] [int] NOT NULL,
	[Customer_id] [int] NOT NULL,
	[logo] [nvarchar](255) NULL,
	[name] [varchar](255) NULL,
	[contact] [varchar](255) NULL,
	[address1] [varchar](255) NULL,
	[address2] [varchar](255) NULL,
	[city] [varchar](50) NULL,
	[state] [varchar](50) NULL,
	[zip] [varchar](50) NULL,
	[country] [nvarchar](50) NULL,
	[phone] [varchar](150) NULL,
	[fax] [varchar](50) NULL,
	[email] [varchar](150) NULL,
	[website] [nvarchar](255) NULL,
	[short_desc] [varchar](500) NULL,
	[priority] [int] NOT NULL,
	[category_id] [int] NOT NULL,
	[dealer_latitude] [nvarchar](50) NULL,
	[dealer_longitude] [nvarchar](50) NULL,
	[start_date] [datetime] NULL,
	[display] [int] NOT NULL,
 CONSTRAINT [Dealer_PK] PRIMARY KEY CLUSTERED 
(
	[Dealer_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Dealer_Categories]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Dealer_Categories](
	[category_ID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](75) NULL,
	[priority] [int] NOT NULL,
 CONSTRAINT [Dealer_Categories_PK] PRIMARY KEY CLUSTERED 
(
	[category_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Dealer_Settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Dealer_Settings](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[GoogleAPIKey] [nvarchar](500) NULL,
	[map_style] [int] NOT NULL,
	[show_category] [int] NOT NULL,
	[show_google] [int] NOT NULL,
	[show_allpoints] [int] NOT NULL,
	[show_country_search] [int] NOT NULL,
 CONSTRAINT [Dealer_Settings_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Discount_Categories]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Discount_Categories](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Discount_ID] [int] NOT NULL,
	[Category_ID] [int] NOT NULL,
 CONSTRAINT [Discount_Categories_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Discount_Groups]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Discount_Groups](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Discount_ID] [int] NOT NULL,
	[Group_ID] [int] NOT NULL,
 CONSTRAINT [Discount_Groups_PK] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Discount_Products]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Discount_Products](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Discount_ID] [int] NOT NULL,
	[Product_ID] [int] NOT NULL,
 CONSTRAINT [Discount_Products_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Discount_ShippingMethods]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Discount_ShippingMethods](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Discount_ID] [int] NULL,
	[Shipping_Type] [nvarchar](100) NULL,
	[ShippingMethod_ID] [int] NULL,
 CONSTRAINT [Discount_ShippingMethods_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Discounts]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Discounts](
	[Discount_ID] [int] IDENTITY(1,1) NOT NULL,
	[Type1] [int] NOT NULL,
	[Type2] [int] NOT NULL,
	[Type3] [int] NOT NULL,
	[Type4] [int] NOT NULL,
	[Type5] [int] NOT NULL,
	[Coup_Code] [nvarchar](50) NULL,
	[OneTime] [bit] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Display] [nvarchar](255) NULL,
	[Amount] [float] NOT NULL,
	[MinOrder] [float] NOT NULL,
	[MaxOrder] [float] NOT NULL,
	[StartDate] [datetime] NULL,
	[EndDate] [datetime] NULL,
	[AccessKey] [int] NULL,
	[Discountonsubsite] [bit] NOT NULL,
 CONSTRAINT [Discounts_PK] PRIMARY KEY CLUSTERED 
(
	[Discount_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Easypost]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Easypost](
	[EasyPostID] [int] IDENTITY(1,1) NOT NULL,
	[EasyPostApiKey] [nvarchar](100) NULL,
	[EasyPostCallURL] [nvarchar](100) NULL,
	[MerchantFullName] [nvarchar](100) NULL,
	[MerchantAddress1] [nvarchar](200) NULL,
	[MerchantAddress2] [nvarchar](200) NULL,
	[MerchantCity] [nvarchar](100) NULL,
	[MerchantState] [nvarchar](100) NULL,
	[MerchantZipcode] [nvarchar](100) NULL,
	[MerchantPhone] [nvarchar](100) NULL,
	[MerchantEmail] [nvarchar](100) NULL,
	[customs_signer] [nvarchar](100) NULL,
	[non_delivery_option] [nvarchar](100) NULL,
	[useshipbox] [int] NOT NULL,
	[UseAV] [bit] NOT NULL,
	[debug] [bit] NOT NULL,
	[Show_delivery_date] [bit] NOT NULL,
	[default_prep_days] [tinyint] NOT NULL,
	[AddOneDay_time] [datetime] NULL,
	[ShowShipFrom] [tinyint] NULL,
	[Friendly_Name] [varchar](150) NULL,
	[Email_customer] [tinyint] NOT NULL,
	[SMS_customer] [tinyint] NOT NULL,
	[Rate_to_show] [tinyint] NOT NULL,
	[NucomClientKey] [nvarchar](50) NULL,
	[NucomClientSecret] [nvarchar](100) NULL,
	[NucomAPIKey] [nvarchar](100) NULL,
	[CFWebstoreURL] [nvarchar](100) NULL,
	[NucomAccessToken] [nvarchar](500) NULL,
	[NucomServicesURL] [nvarchar](250) NULL,
 CONSTRAINT [Easypost_PK] PRIMARY KEY CLUSTERED 
(
	[EasyPostID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Easypost_box_size]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Easypost_box_size](
	[box_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](75) NULL,
	[height] [float] NULL,
	[width] [float] NULL,
	[length] [float] NULL,
	[packaging] [int] NULL,
	[weight] [float] NULL,
	[notes] [nvarchar](500) NULL,
	[NewIDTag] [nvarchar](200) NULL,
 CONSTRAINT [Easypost_box_size_PK] PRIMARY KEY CLUSTERED 
(
	[box_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Easypost_HS_number]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Easypost_HS_number](
	[HS_ID] [int] IDENTITY(1,1) NOT NULL,
	[HS_tariff_number] [nvarchar](10) NULL,
	[Description] [nvarchar](500) NULL,
	[Priority] [int] NULL,
	[Header] [bit] NULL,
 CONSTRAINT [Easypost_HS_number_PK] PRIMARY KEY CLUSTERED 
(
	[HS_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Easypost_Label]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Easypost_Label](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Customer_id] [int] NOT NULL,
	[Easypostshipmentid] [nvarchar](100) NULL,
	[Easypostshipmentid_return] [nvarchar](100) NULL,
	[ShippingLabel] [nvarchar](100) NULL,
	[ReturnLabel] [nvarchar](100) NULL,
	[Actual_Shipping] [float] NOT NULL,
	[Tracking] [nvarchar](250) NULL,
	[DateAdded] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EasypostMethods]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EasypostMethods](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NULL,
	[Friendly_Name] [nvarchar](100) NULL,
	[MethodHand] [float] NOT NULL,
	[MethodWeight] [float] NOT NULL,
	[Used] [bit] NULL,
	[Priority] [int] NULL,
 CONSTRAINT [EasypostMethods_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EasypostWebhook]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EasypostWebhook](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[status] [nvarchar](250) NULL,
	[Mode] [nvarchar](100) NULL,
	[TrackingCode] [nvarchar](250) NULL,
	[EstDeliveryDate] [nvarchar](250) NULL,
	[Carrier] [nvarchar](250) NULL,
	[response] [ntext] NULL,
	[error] [ntext] NULL,
	[enterdate] [datetime] NULL,
 CONSTRAINT [EasypostWebhook_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Engraving_Settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Engraving_Settings](
	[Engraving_ID] [int] NOT NULL,
	[Engraveable] [bit] NOT NULL,
	[Engraving_Lines_Team] [int] NOT NULL,
	[Engraving_Lines_Promotional] [int] NOT NULL,
	[Engraving_Lines_Imprinting] [int] NOT NULL,
	[Engraving_Lines_Custom] [int] NOT NULL,
	[Engraving_Lines_Engraving] [int] NOT NULL,
	[Per_Letter_Engraving_Cost] [float] NOT NULL,
	[LogoEngravingSetup] [float] NOT NULL,
	[LogoEngraving] [float] NOT NULL,
	[Free_Engraving] [bit] NOT NULL,
	[Proof_Available] [bit] NOT NULL,
	[Prep_Days] [int] NOT NULL,
	[Blocks_Per_Page] [int] NOT NULL,
	[Text_Line_Length] [int] NOT NULL,
	[Colors_Per_Prod] [int] NOT NULL,
	[ColorSetupCharge_1] [float] NOT NULL,
	[ColorSetupCharge_2] [float] NOT NULL,
	[ColorSetupCharge_3] [float] NOT NULL,
	[ColorSetupCharge_4] [float] NOT NULL,
	[ColorSetupCharge_5] [float] NOT NULL,
	[ColorRunCharge_BAK] [float] NOT NULL,
	[ImprintCharge_1] [float] NULL,
	[ImprintCharge_2] [float] NULL,
	[ImprintCharge_3] [float] NULL,
	[ImprintCharge_4] [float] NULL,
	[ImprintCharge_5] [float] NULL,
 CONSTRAINT [PK__Engraving_Settings] PRIMARY KEY CLUSTERED 
(
	[Engraving_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Feature_Category]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Feature_Category](
	[Feature_Category_ID] [int] IDENTITY(1,1) NOT NULL,
	[Feature_ID] [int] NOT NULL,
	[Category_ID] [int] NOT NULL,
 CONSTRAINT [Feature_Category_PK] PRIMARY KEY CLUSTERED 
(
	[Feature_Category_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Feature_Item]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Feature_Item](
	[Feature_Item_ID] [int] IDENTITY(1,1) NOT NULL,
	[Feature_ID] [int] NOT NULL,
	[Item_ID] [int] NOT NULL,
 CONSTRAINT [Feature_Item_PK] PRIMARY KEY CLUSTERED 
(
	[Feature_Item_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Feature_Product]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Feature_Product](
	[Feature_Product_ID] [int] IDENTITY(1,1) NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Feature_ID] [int] NOT NULL,
 CONSTRAINT [Feature_Product_PK] PRIMARY KEY CLUSTERED 
(
	[Feature_Product_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FeatureReviews]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FeatureReviews](
	[Review_ID] [int] IDENTITY(1,1) NOT NULL,
	[Feature_ID] [int] NOT NULL,
	[Parent_ID] [int] NULL,
	[User_ID] [int] NULL,
	[Anonymous] [bit] NOT NULL,
	[Anon_Name] [nvarchar](100) NULL,
	[Anon_Loc] [nvarchar](100) NULL,
	[Anon_Email] [nvarchar](100) NULL,
	[Editorial] [nvarchar](50) NULL,
	[Title] [nvarchar](75) NULL,
	[Comment] [ntext] NULL,
	[Rating] [int] NULL,
	[Recommend] [bit] NOT NULL,
	[Posted] [datetime] NOT NULL,
	[Updated] [datetime] NULL,
	[Approved] [bit] NOT NULL,
	[NeedsCheck] [bit] NOT NULL,
 CONSTRAINT [FeatureReviews_PK] PRIMARY KEY CLUSTERED 
(
	[Review_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Features]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Features](
	[Feature_ID] [int] IDENTITY(1,1) NOT NULL,
	[User_ID] [int] NULL,
	[Feature_Type] [nvarchar](50) NULL,
	[Name] [nvarchar](125) NOT NULL,
	[Author] [nvarchar](50) NULL,
	[Copyright] [nvarchar](50) NULL,
	[Display] [bit] NOT NULL,
	[Approved] [bit] NOT NULL,
	[Start] [datetime] NULL,
	[Expire] [datetime] NULL,
	[Priority] [int] NULL,
	[AccessKey] [int] NULL,
	[Highlight] [bit] NOT NULL,
	[Display_Title] [bit] NOT NULL,
	[Reviewable] [bit] NOT NULL,
	[Sm_Title] [nvarchar](150) NULL,
	[Sm_Image] [nvarchar](150) NULL,
	[Sm_image_width] [int] NULL,
	[Sm_image_height] [int] NULL,
	[Lg_image_width] [int] NULL,
	[Lg_image_height] [int] NULL,
	[Short_Desc] [ntext] NULL,
	[Lg_Title] [nvarchar](150) NULL,
	[Lg_image] [nvarchar](150) NULL,
	[Long_Desc] [ntext] NULL,
	[PassParam] [nvarchar](150) NULL,
	[Color_ID] [int] NULL,
	[Created] [datetime] NULL,
	[Metadescription] [nvarchar](255) NULL,
	[Keywords] [nvarchar](255) NULL,
	[TitleTag] [nvarchar](255) NULL,
	[Permalink] [nvarchar](1000) NULL,
 CONSTRAINT [Features_PK] PRIMARY KEY NONCLUSTERED 
(
	[Feature_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Federal_holidays]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Federal_holidays](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](150) NULL,
	[Date_of_holiday] [date] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FedEx_Dropoff]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FedEx_Dropoff](
	[FedEx_Code] [nvarchar](30) NOT NULL,
	[Description] [nvarchar](50) NULL,
 CONSTRAINT [FedEx_Dropoff_PK] PRIMARY KEY CLUSTERED 
(
	[FedEx_Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FedEx_Packaging]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FedEx_Packaging](
	[FedEx_Code] [nvarchar](20) NOT NULL,
	[Description] [nvarchar](50) NULL,
 CONSTRAINT [FedEx_Packaging_PK] PRIMARY KEY CLUSTERED 
(
	[FedEx_Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FedEx_Settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FedEx_Settings](
	[Fedex_ID] [int] IDENTITY(1,1) NOT NULL,
	[AccountNo] [nvarchar](20) NULL,
	[MeterNum] [nvarchar](20) NULL,
	[MaxWeight] [int] NULL,
	[UnitsofMeasure] [nvarchar](20) NULL,
	[Dropoff] [nvarchar](20) NULL,
	[Packaging] [nvarchar](20) NULL,
	[OrigZip] [nvarchar](20) NULL,
	[OrigState] [nvarchar](75) NULL,
	[OrigCountry] [nvarchar](10) NULL,
	[Debug] [bit] NOT NULL,
	[UseGround] [bit] NOT NULL,
	[UseExpress] [bit] NOT NULL,
	[Logging] [bit] NOT NULL,
	[UserKey] [nvarchar](75) NULL,
	[Password] [nvarchar](150) NULL,
	[UseSmartPost] [bit] NOT NULL,
	[AddInsurance] [bit] NOT NULL,
 CONSTRAINT [FedEx_Settings_PK] PRIMARY KEY CLUSTERED 
(
	[Fedex_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FedExMethods]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FedExMethods](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](75) NULL,
	[Used] [bit] NOT NULL,
	[Shipper] [nvarchar](10) NULL,
	[Code] [nvarchar](75) NULL,
	[Priority] [int] NULL,
	[MethodHand] [float] NOT NULL,
	[MethodWeight] [float] NOT NULL,
 CONSTRAINT [FedExMethods_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Footer]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Footer](
	[Footer_id] [int] IDENTITY(1,1) NOT NULL,
	[Footer_name] [nvarchar](100) NULL,
	[Display] [bit] NOT NULL,
	[Title] [nvarchar](150) NULL,
	[Short_desc] [nvarchar](2000) NULL,
	[Menu_id] [int] NOT NULL,
	[SettingID] [int] NOT NULL,
	[Display_ContactInfo] [tinyint] NULL,
	[Display_SocialIcons] [tinyint] NULL,
	[Display_mailchimp_signup] [tinyint] NULL,
	[Display_constantcontact_signup] [tinyint] NULL,
	[Position] [int] NOT NULL,
 CONSTRAINT [Footer_PK] PRIMARY KEY NONCLUSTERED 
(
	[Footer_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Gallery]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Gallery](
	[gallery_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NULL,
	[subtitle] [nvarchar](100) NULL,
	[text] [nvarchar](500) NULL,
	[speed] [int] NULL,
	[sm_image_width] [int] NULL,
	[sm_image_height] [int] NULL,
	[lg_image_width] [int] NULL,
	[lg_image_height] [int] NULL,
	[gallery_style] [int] NULL,
	[masonry_columns] [int] NULL,
	[transition] [int] NOT NULL,
	[convertToWebp] [bit] NOT NULL,
	[priority] [int] NOT NULL,
 CONSTRAINT [PK_Gallery] PRIMARY KEY CLUSTERED 
(
	[gallery_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Gallery_category]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Gallery_category](
	[category_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NULL,
	[description] [nvarchar](500) NULL,
	[priority] [int] NOT NULL,
 CONSTRAINT [PK_Gallery_category] PRIMARY KEY CLUSTERED 
(
	[category_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Gallery_Images]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Gallery_Images](
	[image_id] [int] IDENTITY(1,1) NOT NULL,
	[original] [nvarchar](300) NULL,
	[lg_image] [nvarchar](300) NULL,
	[sm_image] [nvarchar](300) NULL,
	[Sm_image_width] [int] NULL,
	[Sm_image_height] [int] NULL,
	[Lg_image_width] [int] NULL,
	[Lg_image_height] [int] NULL,
	[priority] [int] NOT NULL,
	[gallery_id] [int] NOT NULL,
	[description] [nvarchar](2000) NULL,
	[name] [nvarchar](250) NULL,
	[link] [nvarchar](150) NULL,
	[subtitle] [nvarchar](150) NULL,
	[email] [nvarchar](150) NULL,
	[phone] [nvarchar](150) NULL,
	[linkedin] [nvarchar](150) NULL,
	[target] [int] NOT NULL,
	[category_id] [int] NOT NULL,
	[startdate] [datetime] NULL,
	[enddate] [datetime] NULL,
	[video_mp4] [nvarchar](300) NULL,
	[video_webm] [nvarchar](300) NULL,
	[video_ogg] [nvarchar](300) NULL,
	[video_external] [nvarchar](500) NULL,
	[video_width] [int] NULL,
	[video_height] [int] NULL,
 CONSTRAINT [PK_Gallery_Images] PRIMARY KEY CLUSTERED 
(
	[image_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GiftItems]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GiftItems](
	[GiftItem_ID] [int] IDENTITY(1,1) NOT NULL,
	[GiftRegistry_ID] [int] NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Options] [ntext] NULL,
	[Addons] [ntext] NULL,
	[AddonMultP] [float] NULL,
	[AddonNonMultP] [float] NULL,
	[AddonMultW] [float] NULL,
	[AddonNonMultW] [float] NULL,
	[OptPrice] [float] NOT NULL,
	[OptWeight] [float] NOT NULL,
	[OptQuant] [int] NOT NULL,
	[OptChoice] [int] NOT NULL,
	[OptionID_List] [nvarchar](255) NULL,
	[ChoiceID_List] [nvarchar](255) NULL,
	[SKU] [nvarchar](100) NULL,
	[ALU] [nvarchar](100) NULL,
	[UPC] [nvarchar](100) NULL,
	[Price] [float] NOT NULL,
	[Weight] [float] NOT NULL,
	[Quantity_Requested] [int] NOT NULL,
	[Quantity_Purchased] [int] NOT NULL,
	[DateAdded] [datetime] NULL,
 CONSTRAINT [GiftItems_PK] PRIMARY KEY CLUSTERED 
(
	[GiftItem_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GiftRegistry]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GiftRegistry](
	[GiftRegistry_ID] [int] IDENTITY(1,1) NOT NULL,
	[User_ID] [int] NOT NULL,
	[Registrant] [nvarchar](75) NULL,
	[OtherName] [nvarchar](50) NULL,
	[GiftRegistry_Type] [nvarchar](50) NULL,
	[Event_Date] [datetime] NULL,
	[Event_Name] [nvarchar](50) NULL,
	[Event_Descr] [nvarchar](500) NULL,
	[Private] [bit] NOT NULL,
	[Order_Notification] [bit] NOT NULL,
	[Live] [bit] NOT NULL,
	[Approved] [bit] NOT NULL,
	[City] [nvarchar](150) NULL,
	[State] [nvarchar](50) NULL,
	[Created] [datetime] NULL,
	[Expire] [datetime] NULL,
	[ID_Tag] [nvarchar](35) NULL,
 CONSTRAINT [GiftRegistry_PK] PRIMARY KEY CLUSTERED 
(
	[GiftRegistry_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Giftwrap]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Giftwrap](
	[Giftwrap_ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](60) NOT NULL,
	[Short_Desc] [ntext] NULL,
	[Sm_Image] [nvarchar](150) NULL,
	[Price] [float] NOT NULL,
	[Weight] [float] NOT NULL,
	[Priority] [int] NOT NULL,
	[Display] [bit] NOT NULL,
 CONSTRAINT [Giftwrap_PK] PRIMARY KEY CLUSTERED 
(
	[Giftwrap_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Google_product_category]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Google_product_category](
	[ID] [int] NOT NULL,
	[Description] [nvarchar](250) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Groups]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Groups](
	[Group_ID] [int] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [ntext] NULL,
	[Permissions] [nvarchar](255) NULL,
	[Wholesale] [bit] NOT NULL,
	[Group_Code] [nvarchar](20) NULL,
	[TaxExempt] [bit] NOT NULL,
	[ShipExempt] [bit] NOT NULL,
 CONSTRAINT [Groups_PK] PRIMARY KEY NONCLUSTERED 
(
	[Group_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Homepage]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Homepage](
	[ID] [int] NOT NULL,
	[Gallery_display] [bit] NOT NULL,
	[Gallery_id] [int] NOT NULL,
	[Gallery_title] [nvarchar](50) NULL,
	[Gallery_transition] [bit] NOT NULL,
	[Gallery_max] [int] NOT NULL,
	[Gallery_priority] [int] NOT NULL,
	[Gallery_fullwidth] [bit] NOT NULL,
	[Gallery_over_menu] [tinyint] NOT NULL,
	[Gallery_height] [int] NOT NULL,
	[Gallery2_display] [bit] NOT NULL,
	[Gallery2_id] [int] NOT NULL,
	[Gallery2_title] [nvarchar](50) NULL,
	[Gallery2_transition] [int] NOT NULL,
	[Gallery2_max] [int] NOT NULL,
	[Gallery2_priority] [int] NOT NULL,
	[Topcats_display] [bit] NOT NULL,
	[Topcats_allcats] [bit] NOT NULL,
	[Topcats_cols] [int] NOT NULL,
	[Topcats_title] [nvarchar](100) NULL,
	[Topcats_categories] [nvarchar](100) NULL,
	[Topcats_catStyle] [nvarchar](100) NULL,
	[Topcats_priority] [int] NOT NULL,
	[Carousel_display] [bit] NOT NULL,
	[Carousel_name] [nvarchar](100) NULL,
	[Carousel_selectors] [nvarchar](100) NULL,
	[Carousel_priority] [int] NOT NULL,
	[Carousel_altImage1] [nvarchar](500) NULL,
	[Carousel_altImage1_Width] [int] NULL,
	[Carousel_altImage1_Height] [int] NULL,
	[Carousel_altImage1_link] [nvarchar](500) NULL,
	[Carousel_altImage1_altText] [nvarchar](500) NULL,
	[Carousel_altImage1_button] [nvarchar](100) NULL,
	[Carousel_altImage2] [nvarchar](500) NULL,
	[Carousel_altImage2_Width] [int] NULL,
	[Carousel_altImage2_Height] [int] NULL,
	[Carousel_altImage2_link] [nvarchar](500) NULL,
	[Carousel_altImage2_altText] [nvarchar](500) NULL,
	[Carousel_altImage2_button] [nvarchar](100) NULL,
	[Masonry_display] [bit] NOT NULL,
	[Masonry_name] [nvarchar](100) NULL,
	[Masonry_selectors] [nvarchar](100) NULL,
	[Masonry_1stbox] [nvarchar](2000) NULL,
	[Masonry_priority] [int] NOT NULL,
	[Blog_display] [bit] NOT NULL,
	[Blog_cols] [int] NOT NULL,
	[Blog_name] [nvarchar](100) NULL,
	[Blog_priority] [int] NOT NULL,
	[Alert_display] [bit] NOT NULL,
	[Alert_text] [nvarchar](4000) NULL,
	[Alert_priority] [int] NOT NULL,
	[Alert_fullwidth] [bit] NOT NULL,
	[Hero_display] [bit] NOT NULL,
	[Hero_image] [nvarchar](300) NULL,
	[Hero_image_Width] [int] NULL,
	[Hero_image_Height] [int] NULL,
	[Hero_image_360] [nvarchar](300) NULL,
	[Hero_image_720] [nvarchar](300) NULL,
	[Hero_text] [nvarchar](1000) NULL,
	[Hero_text_position] [int] NOT NULL,
	[Hero_button] [nvarchar](250) NULL,
	[Hero_button_color] [nvarchar](250) NULL,
	[Hero_link] [nvarchar](1000) NULL,
	[Hero_over_menu] [bit] NOT NULL,
	[Hero_height] [int] NOT NULL,
	[Hero_priority] [int] NOT NULL,
	[Hero_text1] [nvarchar](255) NULL,
	[Hero_text2] [nvarchar](255) NULL,
	[Hero_text3] [nvarchar](255) NULL,
	[Hero_text4] [nvarchar](255) NULL,
	[Hero_altimage1] [nvarchar](255) NULL,
	[Hero_altimage1_text] [nvarchar](255) NULL,
	[Hero_altimage1_link] [nvarchar](255) NULL,
	[Hero_altimage2] [nvarchar](255) NULL,
	[Hero_altimage2_text] [nvarchar](255) NULL,
	[Hero_altimage2_link] [nvarchar](255) NULL,
	[Testimonial_display] [bit] NOT NULL,
	[Testimonial_priority] [int] NOT NULL,
	[Testimonial_fullwidth] [bit] NOT NULL,
	[Testimonial_product_id] [int] NOT NULL,
	[Testimonial_list_id] [int] NOT NULL,
	[Product_display] [bit] NOT NULL,
	[Product_fullwidth] [bit] NOT NULL,
	[Product_style] [int] NOT NULL,
	[Product_priority] [int] NOT NULL,
	[Product_title] [nvarchar](250) NULL,
	[Product_passparam] [nvarchar](250) NULL,
	[Custom_text_1] [nvarchar](max) NULL,
	[Custom_text_1_priority] [int] NOT NULL,
	[Custom_text_1_display] [bit] NOT NULL,
	[Custom_text_1_fullwidth] [bit] NOT NULL,
	[Custom_text_2] [nvarchar](max) NULL,
	[Custom_text_2_priority] [int] NOT NULL,
	[Custom_text_2_display] [bit] NOT NULL,
	[Custom_text_2_fullwidth] [bit] NOT NULL,
	[Custom_text_3] [nvarchar](max) NULL,
	[Custom_text_3_priority] [int] NOT NULL,
	[Custom_text_3_display] [bit] NOT NULL,
	[Custom_text_3_fullwidth] [bit] NOT NULL,
	[Custom_image_1] [nvarchar](255) NULL,
	[Custom_image_2] [nvarchar](255) NULL,
	[Custom_image_3] [nvarchar](255) NULL,
	[Custom_image_4] [nvarchar](255) NULL,
	[Custom_image_5] [nvarchar](255) NULL,
	[Custom_image_6] [nvarchar](255) NULL,
	[Custom_image_7] [nvarchar](255) NULL,
	[Custom_image_8] [nvarchar](255) NULL,
	[Custom_image_9] [nvarchar](255) NULL,
	[Custom_image_10] [nvarchar](255) NULL,
	[Custom_Image_1_Width] [int] NULL,
	[Custom_Image_2_Width] [int] NULL,
	[Custom_Image_3_Width] [int] NULL,
	[Custom_Image_4_Width] [int] NULL,
	[Custom_Image_5_Width] [int] NULL,
	[Custom_Image_6_Width] [int] NULL,
	[Custom_Image_7_Width] [int] NULL,
	[Custom_Image_8_Width] [int] NULL,
	[Custom_Image_9_Width] [int] NULL,
	[Custom_Image_10_Width] [int] NULL,
	[Custom_Image_1_Height] [int] NULL,
	[Custom_Image_2_Height] [int] NULL,
	[Custom_Image_3_Height] [int] NULL,
	[Custom_Image_4_Height] [int] NULL,
	[Custom_Image_5_Height] [int] NULL,
	[Custom_Image_6_Height] [int] NULL,
	[Custom_Image_7_Height] [int] NULL,
	[Custom_Image_8_Height] [int] NULL,
	[Custom_Image_9_Height] [int] NULL,
	[Custom_Image_10_Height] [int] NULL,
	[Contact_display] [tinyint] NOT NULL,
	[Contact_priority] [int] NOT NULL,
	[Custom_code_1_display] [tinyint] NOT NULL,
	[Custom_code_1_priority] [int] NOT NULL,
	[Custom_code_1_passparam] [nvarchar](255) NULL,
 CONSTRAINT [Homepage_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[InventoryImport]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InventoryImport](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Description 1] [varchar](500) NULL,
	[Attribute] [varchar](500) NULL,
	[Size] [varchar](500) NULL,
	[On-hand Qty] [float] NULL,
	[Cost] [float] NULL,
	[Description 2] [varchar](500) NULL,
	[Active Price] [float] NULL,
	[Vendor Name] [varchar](500) NULL,
	[Item ##] [int] NULL,
 CONSTRAINT [InventoryImport_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[lightspeed_settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[lightspeed_settings](
	[LightSpeed_ID] [int] NOT NULL,
	[Client_Id] [nvarchar](100) NULL,
	[Client_Secret] [nvarchar](100) NULL,
	[Access_Token] [nvarchar](100) NULL,
	[Refresh_Token] [nvarchar](100) NULL,
	[Scope] [nvarchar](250) NULL,
	[Account_Id] [nvarchar](100) NULL,
	[Account_Name] [nvarchar](250) NULL,
	[ShopId] [int] NOT NULL,
	[Scheduled] [bit] NOT NULL,
	[StartDate] [datetime] NULL,
	[LastRunDate] [datetime] NULL,
	[Status] [nvarchar](250) NULL,
	[total] [bigint] NOT NULL,
	[offset] [bigint] NOT NULL,
	[test] [bit] NOT NULL,
	[importScheduled] [bit] NOT NULL,
	[totalImport] [bigint] NULL,
	[offsetImport] [bigint] NULL,
	[importStartDt] [datetime] NULL,
	[importEndDt] [datetime] NULL,
	[ApiServerUrl] [nvarchar](250) NULL,
	[ApiSecretKey] [nvarchar](250) NULL,
	[NucomClientKey] [nvarchar](50) NULL,
	[NucomClientSecret] [nvarchar](100) NULL,
	[NucomAPIKey] [nvarchar](100) NULL,
	[CFWebstoreURL] [nvarchar](100) NULL,
	[NucomAccessToken] [nvarchar](500) NULL,
	[NucomServicesURL] [nvarchar](250) NULL,
 CONSTRAINT [LightSpeed_settings_PK] PRIMARY KEY CLUSTERED 
(
	[LightSpeed_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LightSpeedData]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LightSpeedData](
	[ItemId] [bigint] NOT NULL,
	[ItemMatrixId] [bigint] NOT NULL,
	[CustomSKU] [nvarchar](150) NULL,
	[SystemSKU] [nvarchar](150) NULL,
	[UPC] [nvarchar](150) NULL,
	[CategoryId] [nvarchar](150) NULL,
	[ManufacturerId] [nvarchar](150) NULL,
	[ManufacturerSKU] [nvarchar](150) NULL,
	[PublishToEcom] [bit] NULL,
	[LsCreatedDate] [datetime] NULL,
	[LsTimestamp] [datetime] NULL,
	[EnterDate] [datetime] NULL,
	[LastUpdatedDate] [datetime] NULL,
	[SyncState] [nvarchar](150) NULL,
	[SyncStep] [nvarchar](150) NULL,
	[SyncStatus] [nvarchar](150) NULL,
	[ErrorDesc] [ntext] NULL,
	[updateCount] [bigint] NOT NULL,
	[ItemExists] [bit] NULL,
	[Deleted] [bit] NOT NULL,
	[Product_id] [bigint] NULL,
	[RetryCount] [int] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[List]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[List](
	[list_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NULL,
	[text] [nvarchar](500) NULL,
	[List_style] [int] NOT NULL,
	[priority] [int] NOT NULL,
 CONSTRAINT [PK_List] PRIMARY KEY CLUSTERED 
(
	[list_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[List_Category]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[List_Category](
	[Category_ID] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NULL,
	[priority] [int] NOT NULL,
 CONSTRAINT [PK_List_Category] PRIMARY KEY CLUSTERED 
(
	[Category_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[List_questions]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[List_questions](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[question] [nvarchar](300) NULL,
	[answer] [nvarchar](3000) NULL,
	[priority] [int] NOT NULL,
	[display] [bit] NOT NULL,
	[list_id] [int] NOT NULL,
	[category_id] [int] NOT NULL,
 CONSTRAINT [PK_List_Questions] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Locales]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Locales](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](30) NOT NULL,
	[CurrExchange] [nvarchar](50) NULL,
 CONSTRAINT [Locales_PK] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LocalTax]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LocalTax](
	[Local_ID] [int] IDENTITY(1,1) NOT NULL,
	[Code_ID] [int] NOT NULL,
	[ZipCode] [nvarchar](20) NOT NULL,
	[Tax] [float] NOT NULL,
	[EndZip] [nvarchar](20) NULL,
	[TaxShip] [bit] NOT NULL,
 CONSTRAINT [LocalTax_PK] PRIMARY KEY CLUSTERED 
(
	[Local_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Log]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Log](
	[log_id] [int] IDENTITY(1,1) NOT NULL,
	[order_no] [int] NULL,
	[status] [varchar](50) NULL,
	[type] [int] NULL,
	[code] [varchar](100) NULL,
	[message] [varchar](2000) NULL,
	[custom1] [varchar](500) NULL,
	[custom2] [varchar](500) NULL,
	[custom3] [varchar](500) NULL,
	[RowNo] [int] NOT NULL,
	[ErrorType] [varchar](50) NULL,
	[FileName] [varchar](50) NULL,
	[FilePath] [varchar](500) NULL,
	[SKU] [varchar](50) NULL,
	[dateadded] [date] NULL,
	[display] [tinyint] NOT NULL,
	[flag] [tinyint] NOT NULL,
 CONSTRAINT [Log_PK] PRIMARY KEY NONCLUSTERED 
(
	[log_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Log_type]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Log_type](
	[type_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](100) NULL,
	[Priority] [int] NULL,
 CONSTRAINT [Log_type_PK] PRIMARY KEY NONCLUSTERED 
(
	[type_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[mailchimp_settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[mailchimp_settings](
	[Mailchimp_ID] [int] NOT NULL,
	[SettingID] [int] NOT NULL,
	[APIKey] [nvarchar](50) NOT NULL,
	[ListID] [nvarchar](400) NULL,
	[Image] [nvarchar](50) NULL,
	[FullName] [nvarchar](400) NULL,
	[Address1] [nvarchar](400) NULL,
	[Address2] [nvarchar](400) NULL,
	[City] [nvarchar](50) NULL,
	[State] [nvarchar](20) NULL,
	[Zip] [nvarchar](20) NULL,
	[Phone] [nvarchar](20) NULL,
	[Email] [nvarchar](50) NULL,
	[Facebook] [nvarchar](500) NULL,
	[Twitter] [nvarchar](400) NULL,
	[Signup_Form_URL] [nvarchar](250) NULL,
	[Signup_Form_Embed] [nvarchar](max) NULL,
	[NucomClientKey] [nvarchar](50) NULL,
	[NucomClientSecret] [nvarchar](100) NULL,
	[NucomAPIKey] [nvarchar](100) NULL,
	[CFWebstoreURL] [nvarchar](100) NULL,
	[NucomAccessToken] [nvarchar](500) NULL,
	[NucomServicesURL] [nvarchar](250) NULL,
	[Error] [ntext] NULL,
	[ServiceURL] [nvarchar](250) NULL,
	[Subscribe_guests] [bit] NOT NULL,
 CONSTRAINT [Mailchimp_settings_PK] PRIMARY KEY CLUSTERED 
(
	[Mailchimp_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MailText]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MailText](
	[MailText_ID] [int] IDENTITY(1,1) NOT NULL,
	[MailText_Name] [nvarchar](50) NULL,
	[MailText_Message] [ntext] NULL,
	[MailText_Subject] [nvarchar](75) NULL,
	[MailText_Attachment] [nvarchar](255) NULL,
	[System] [bit] NOT NULL,
	[MailAction] [nvarchar](50) NULL,
 CONSTRAINT [MailText_PK] PRIMARY KEY NONCLUSTERED 
(
	[MailText_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Memberships]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Memberships](
	[Membership_ID] [int] IDENTITY(1,1) NOT NULL,
	[User_ID] [int] NULL,
	[Order_ID] [int] NULL,
	[Product_ID] [int] NULL,
	[Membership_Type] [nvarchar](50) NULL,
	[AccessKey_ID] [nvarchar](50) NULL,
	[Start] [datetime] NULL,
	[Time_Count] [int] NULL,
	[Access_Count] [int] NULL,
	[Expire] [datetime] NULL,
	[Valid] [bit] NOT NULL,
	[Date_Ordered] [datetime] NULL,
	[Access_Used] [int] NULL,
	[Recur] [bit] NOT NULL,
	[Recur_Product_ID] [int] NULL,
	[Suspend_Begin_Date] [datetime] NULL,
	[Next_Membership_ID] [int] NULL,
	[ID_Tag] [nvarchar](35) NULL,
 CONSTRAINT [Memberships_PK] PRIMARY KEY CLUSTERED 
(
	[Membership_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order_Items]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order_Items](
	[Order_No] [int] NOT NULL,
	[Item_ID] [int] NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Options] [ntext] NULL,
	[Addons] [ntext] NULL,
	[AddonMultP] [float] NULL,
	[AddonNonMultP] [float] NULL,
	[Price] [float] NOT NULL,
	[Per_Item_Weight] [float] NOT NULL,
	[Quantity] [int] NOT NULL,
	[Quantity_Shipped] [int] NOT NULL,
	[OptPrice] [float] NOT NULL,
	[sm_image] [nvarchar](250) NULL,
	[SKU] [nvarchar](100) NULL,
	[ALU] [nvarchar](100) NULL,
	[UPC] [nvarchar](100) NULL,
	[OptQuant] [int] NOT NULL,
	[OptChoice] [int] NULL,
	[OptionID_List] [nvarchar](255) NULL,
	[ChoiceID_List] [nvarchar](255) NULL,
	[DiscAmount] [float] NULL,
	[Disc_Code] [nvarchar](50) NULL,
	[PromoAmount] [float] NULL,
	[PromoQuant] [int] NULL,
	[Promo_Code] [nvarchar](50) NULL,
	[Name] [nvarchar](255) NULL,
	[Dropship_Account_ID] [int] NULL,
	[Dropship_Qty] [int] NULL,
	[Dropship_SKU] [nvarchar](50) NULL,
	[Dropship_Cost] [float] NULL,
	[Dropship_Note] [nvarchar](75) NULL,
	[Editable] [bit] NOT NULL,
	[SKU_ID] [int] NULL,
	[Hide_in_Cart] [bit] NOT NULL,
	[DateAdded_to_basket] [datetime] NULL,
	[Amazon_OrderItemID] [nvarchar](75) NULL,
	[Certificate_number] [nvarchar](250) NULL,
	[Subscription] [bit] NOT NULL,
	[Subscription_discount] [float] NOT NULL,
	[Subscription_period] [int] NOT NULL,
	[PackageNum] [nvarchar](50) NULL,
	[PackageParent] [int] NOT NULL,
	[Category_id] [int] NOT NULL,
	[SortNo] [int] NULL,
	[Shipping_Message] [nvarchar](500) NULL,
	[Gift] [bit] NOT NULL,
 CONSTRAINT [Order_Items_PK] PRIMARY KEY NONCLUSTERED 
(
	[Order_No] ASC,
	[Item_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order_Items_Quote]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order_Items_Quote](
	[Order_No] [int] NOT NULL,
	[Item_ID] [int] NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Options] [ntext] NULL,
	[Addons] [ntext] NULL,
	[AddonMultP] [float] NULL,
	[AddonNonMultP] [float] NULL,
	[Price] [float] NOT NULL,
	[Quantity] [int] NOT NULL,
	[Quantity_Shipped] [int] NOT NULL,
	[OptPrice] [float] NOT NULL,
	[UPC] [nvarchar](50) NULL,
	[ALU] [nvarchar](100) NULL,
	[SKU] [nvarchar](50) NULL,
	[OptQuant] [int] NOT NULL,
	[OptChoice] [int] NULL,
	[OptionID_List] [nvarchar](255) NULL,
	[ChoiceID_List] [nvarchar](255) NULL,
	[DiscAmount] [float] NULL,
	[Disc_Code] [nvarchar](50) NULL,
	[PromoAmount] [float] NULL,
	[PromoQuant] [int] NULL,
	[Promo_Code] [nvarchar](50) NULL,
	[Name] [nvarchar](255) NULL,
	[Sm_image] [nvarchar](500) NULL,
	[Dropship_Account_ID] [int] NULL,
	[Dropship_Qty] [int] NULL,
	[Dropship_SKU] [nvarchar](50) NULL,
	[Dropship_Cost] [float] NULL,
	[Dropship_Note] [nvarchar](75) NULL,
	[Per_Item_Weight] [float] NOT NULL,
	[Editable] [tinyint] NULL,
	[SKU_ID] [int] NULL,
	[PackageNum] [nvarchar](50) NULL,
	[PackageParent] [int] NOT NULL,
	[Category_id] [int] NOT NULL,
 CONSTRAINT [Order_Items_Quote_PK] PRIMARY KEY NONCLUSTERED 
(
	[Order_No] ASC,
	[Item_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order_Items_refund]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order_Items_refund](
	[Order_No] [int] NOT NULL,
	[Item_ID] [int] NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Options] [varchar](1000) NULL,
	[Addons] [ntext] NULL,
	[AddonMultP] [float] NULL,
	[AddonNonMultP] [float] NULL,
	[Price] [float] NOT NULL,
	[Quantity] [int] NOT NULL,
	[Quantity_Shipped] [int] NOT NULL,
	[OptPrice] [float] NOT NULL,
	[UPC] [nvarchar](50) NULL,
	[ALU] [nvarchar](100) NULL,
	[SKU] [nvarchar](50) NULL,
	[OptQuant] [int] NOT NULL,
	[OptChoice] [int] NULL,
	[OptionID_List] [nvarchar](255) NULL,
	[ChoiceID_List] [nvarchar](255) NULL,
	[DiscAmount] [float] NULL,
	[Disc_Code] [nvarchar](50) NULL,
	[PromoAmount] [float] NULL,
	[PromoQuant] [int] NULL,
	[Promo_Code] [nvarchar](50) NULL,
	[Name] [nvarchar](255) NULL,
	[Dropship_Account_ID] [int] NULL,
	[Dropship_Qty] [int] NULL,
	[Dropship_SKU] [nvarchar](50) NULL,
	[Dropship_Cost] [float] NULL,
	[Dropship_Note] [nvarchar](75) NULL,
	[Per_Item_Weight] [float] NOT NULL,
	[Editable] [tinyint] NULL,
	[SKU_ID] [int] NULL,
	[OLD_orderID] [int] NULL,
	[sm_image] [nvarchar](250) NULL,
	[Amazon_OrderItemID] [nvarchar](25) NULL,
	[DateAdded_to_basket] [datetime] NULL,
	[Hide_in_Cart] [bit] NOT NULL,
	[Certificate_Number] [nvarchar](250) NULL,
	[Subscription_period] [int] NOT NULL,
	[Subscription_discount] [float] NOT NULL,
	[PackageNum] [nvarchar](50) NULL,
	[PackageParent] [int] NOT NULL,
	[Category_id] [int] NOT NULL,
	[Avatax_Transaction_Code] [nvarchar](100) NULL,
	[customer_shipping_shipper] [nvarchar](50) NULL,
	[customer_shipping_account] [nvarchar](50) NULL,
	[customer_shipping_method] [nvarchar](50) NULL,
	[TaxID] [nvarchar](250) NULL,
	[TaxFile] [nvarchar](250) NULL,
	[refundeddate] [datetime] NULL,
	[REFUNDPROCESSED] [bit] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order_No]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order_No](
	[Order_No] [int] IDENTITY(1,1) NOT NULL,
	[Filled] [bit] NOT NULL,
	[Process] [bit] NOT NULL,
	[Void] [bit] NULL,
	[Paid] [bit] NOT NULL,
	[DateOrdered] [datetime] NOT NULL,
	[DateFilled] [datetime] NULL,
	[User_ID] [int] NULL,
	[Customer_ID] [int] NOT NULL,
	[ShipTo] [int] NULL,
	[Card_ID] [int] NULL,
	[OrderTotal] [float] NOT NULL,
	[OriginalTotal] [float] NOT NULL,
	[Tax] [float] NOT NULL,
	[OrderDisc] [float] NOT NULL,
	[Credits] [float] NOT NULL,
	[AddonTotal] [float] NOT NULL,
	[Coup_Code] [nvarchar](50) NULL,
	[Cert_Code] [nvarchar](50) NULL,
	[Giftcard] [nvarchar](255) NULL,
	[Weight] [float] NOT NULL,
	[ShipType] [nvarchar](75) NULL,
	[Shipping] [float] NOT NULL,
	[Actual_shipping] [float] NULL,
	[Freight] [int] NOT NULL,
	[Shipper] [nvarchar](50) NULL,
	[Tracking] [nvarchar](255) NULL,
	[ShippingDisc] [float] NOT NULL,
	[Ship_coup_code] [nvarchar](100) NULL,
	[PayPalStatus] [nvarchar](30) NULL,
	[Status] [nvarchar](50) NULL,
	[Reason] [ntext] NULL,
	[OfflinePayment] [nvarchar](50) NULL,
	[PO_Number] [nvarchar](30) NULL,
	[AuthNumber] [nvarchar](50) NULL,
	[InvoiceNum] [nvarchar](75) NULL,
	[TransactNum] [nvarchar](50) NULL,
	[LastTransactNum] [nvarchar](500) NULL,
	[Affiliate] [int] NULL,
	[Referrer] [nvarchar](255) NULL,
	[IPAddress] [nvarchar](25) NULL,
	[Abandoned] [bit] NULL,
	[TermsUsed] [ntext] NULL,
	[Comments] [nvarchar](255) NULL,
	[Delivery] [nvarchar](50) NULL,
	[CustomText1] [nvarchar](255) NULL,
	[CustomText2] [nvarchar](255) NULL,
	[CustomText3] [nvarchar](50) NULL,
	[CustomSelect1] [nvarchar](100) NULL,
	[CustomSelect2] [nvarchar](100) NULL,
	[Notes] [ntext] NULL,
	[CustomerShippingNotes] [nvarchar](2000) NULL,
	[AdminUser_ID] [int] NOT NULL,
	[Admin_Updated] [datetime] NULL,
	[Admin_Name] [nvarchar](50) NULL,
	[AdminCredit] [float] NOT NULL,
	[AdminCreditText] [nvarchar](500) NULL,
	[Printed_Quote] [int] NOT NULL,
	[Printed_Inv] [int] NOT NULL,
	[Printed_Pack] [int] NOT NULL,
	[Source] [nvarchar](50) NULL,
	[SettingID] [int] NOT NULL,
	[InvDone] [bit] NOT NULL,
	[CodesSent] [bit] NOT NULL,
	[ID_Tag] [nvarchar](35) NULL,
	[Easypostshipmentid] [nvarchar](100) NULL,
	[Easypostshipmentid_return] [nvarchar](100) NULL,
	[ShippingLabel] [nvarchar](100) NULL,
	[ReturnLabel] [nvarchar](100) NULL,
	[IsAddressVerified] [bit] NULL,
	[QB_export] [bit] NOT NULL,
	[QB_Customer_ID] [int] NOT NULL,
	[QBProcess] [bit] NOT NULL,
	[Token1] [nvarchar](50) NULL,
	[Token2] [nvarchar](50) NULL,
	[Token_expiration] [datetime] NULL,
	[Amazon_OrderID] [nvarchar](50) NULL,
	[Amazon_Order_Filled] [int] NOT NULL,
	[Amazon_Fees] [float] NULL,
	[Subscribe_SMS_shipping] [bit] NOT NULL,
	[Avatax_Transaction_Code] [nvarchar](100) NULL,
	[customer_shipping_shipper] [nvarchar](50) NULL,
	[customer_shipping_account] [nvarchar](50) NULL,
	[customer_shipping_method] [nvarchar](50) NULL,
	[TaxID] [nvarchar](250) NULL,
	[TaxFile] [nvarchar](250) NULL,
	[ACH_ID] [int] NULL,
	[ProductReview_Email_Request_Sent] [tinyint] NOT NULL,
	[ProductReview_SMS_Request_Sent] [tinyint] NOT NULL,
	[allPackageInfoHTML] [text] NULL,
 CONSTRAINT [Order_No_PK] PRIMARY KEY NONCLUSTERED 
(
	[Order_No] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order_No_Quote]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order_No_Quote](
	[Order_No] [int] IDENTITY(1,1) NOT NULL,
	[Filled] [bit] NOT NULL,
	[Process] [bit] NOT NULL,
	[Void] [bit] NULL,
	[InvDone] [bit] NOT NULL,
	[Customer_ID] [int] NOT NULL,
	[User_ID] [int] NULL,
	[Card_ID] [int] NULL,
	[ShipTo] [int] NULL,
	[DateOrdered] [datetime] NOT NULL,
	[OriginalTotal] [float] NOT NULL,
	[OrderTotal] [float] NOT NULL,
	[Tax] [float] NOT NULL,
	[ShipType] [nvarchar](75) NULL,
	[Shipping] [float] NOT NULL,
	[Freight] [int] NOT NULL,
	[Comments] [nvarchar](255) NULL,
	[AuthNumber] [nvarchar](50) NULL,
	[InvoiceNum] [nvarchar](75) NULL,
	[TransactNum] [nvarchar](50) NULL,
	[Shipper] [nvarchar](50) NULL,
	[Tracking] [nvarchar](255) NULL,
	[Giftcard] [nvarchar](255) NULL,
	[Delivery] [nvarchar](50) NULL,
	[OrderDisc] [float] NOT NULL,
	[Credits] [float] NOT NULL,
	[AddonTotal] [float] NOT NULL,
	[Coup_Code] [nvarchar](50) NULL,
	[Cert_Code] [nvarchar](50) NULL,
	[Affiliate] [int] NULL,
	[Referrer] [nvarchar](255) NULL,
	[IPAddress] [nvarchar](25) NULL,
	[Abandoned] [bit] NULL,
	[Weight] [float] NOT NULL,
	[CustomText1] [nvarchar](255) NULL,
	[CustomText2] [nvarchar](255) NULL,
	[CustomText3] [nvarchar](50) NULL,
	[CustomSelect1] [nvarchar](100) NULL,
	[CustomSelect2] [nvarchar](100) NULL,
	[DateFilled] [datetime] NULL,
	[PayPalStatus] [nvarchar](30) NULL,
	[Reason] [ntext] NULL,
	[OfflinePayment] [nvarchar](50) NULL,
	[PO_Number] [nvarchar](30) NULL,
	[Notes] [ntext] NULL,
	[AdminUser_ID] [int] NOT NULL,
	[Admin_Updated] [datetime] NULL,
	[Admin_Name] [nvarchar](50) NULL,
	[AdminCredit] [float] NOT NULL,
	[AdminCreditText] [nvarchar](50) NULL,
	[Printed] [int] NOT NULL,
	[Printed_Inv] [bit] NOT NULL,
	[Printed_Pack] [bit] NOT NULL,
	[Printed_quote] [bit] NOT NULL,
	[Status] [nvarchar](50) NULL,
	[Paid] [bit] NOT NULL,
	[CodesSent] [bit] NOT NULL,
	[ID_Tag] [nvarchar](35) NULL,
	[TermsUsed] [ntext] NULL,
	[LastTransactNum] [nvarchar](500) NULL,
	[ShippingLabel] [nvarchar](100) NULL,
	[ReturnLabel] [nvarchar](100) NULL,
	[Actual_shipping] [float] NULL,
	[IsAddressVerified] [bit] NULL,
	[Source] [nvarchar](50) NULL,
	[SettingID] [int] NOT NULL,
	[Easypostshipmentid] [nvarchar](100) NULL,
	[Easypostshipmentid_return] [nvarchar](100) NULL,
	[QB_export] [bit] NOT NULL,
	[QB_Customer_ID] [int] NULL,
	[QBProcess] [bit] NULL,
	[OLD_orderID] [int] NULL,
	[Amazon_OrderID] [nvarchar](50) NULL,
	[Amazon_Order_Filled] [int] NOT NULL,
	[giftCertDisc] [float] NULL,
	[Ship_coup_code] [nvarchar](100) NULL,
	[ShippingDisc] [float] NULL,
	[Amazon_Fees] [float] NULL,
	[Subscribe_SMS_shipping] [bit] NOT NULL,
 CONSTRAINT [Order_No_Quote_PK] PRIMARY KEY NONCLUSTERED 
(
	[Order_No] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order_No_Refund]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order_No_Refund](
	[Order_No_Refund] [int] IDENTITY(1,1) NOT NULL,
	[Order_No] [int] NOT NULL,
	[Filled] [bit] NOT NULL,
	[Process] [bit] NOT NULL,
	[Void] [bit] NULL,
	[InvDone] [bit] NOT NULL,
	[Customer_ID] [int] NOT NULL,
	[User_ID] [int] NULL,
	[Card_ID] [int] NULL,
	[ShipTo] [int] NULL,
	[DateOrdered] [datetime] NOT NULL,
	[OriginalTotal] [float] NOT NULL,
	[OrderTotal] [float] NOT NULL,
	[Tax] [float] NOT NULL,
	[ShipType] [nvarchar](75) NULL,
	[Shipping] [float] NOT NULL,
	[Freight] [int] NOT NULL,
	[Comments] [nvarchar](255) NULL,
	[AuthNumber] [nvarchar](50) NULL,
	[InvoiceNum] [nvarchar](75) NULL,
	[TransactNum] [nvarchar](150) NULL,
	[Shipper] [nvarchar](50) NULL,
	[Tracking] [nvarchar](255) NULL,
	[Giftcard] [nvarchar](255) NULL,
	[Delivery] [nvarchar](50) NULL,
	[OrderDisc] [float] NOT NULL,
	[Credits] [float] NOT NULL,
	[AddonTotal] [float] NOT NULL,
	[Coup_Code] [nvarchar](50) NULL,
	[Cert_Code] [nvarchar](50) NULL,
	[Affiliate] [int] NULL,
	[Referrer] [nvarchar](255) NULL,
	[IPAddress] [nvarchar](25) NULL,
	[Abandoned] [bit] NULL,
	[Weight] [float] NOT NULL,
	[CustomText1] [nvarchar](255) NULL,
	[CustomText2] [nvarchar](255) NULL,
	[CustomText3] [nvarchar](50) NULL,
	[CustomSelect1] [nvarchar](100) NULL,
	[CustomSelect2] [nvarchar](100) NULL,
	[DateFilled] [datetime] NULL,
	[PayPalStatus] [nvarchar](30) NULL,
	[Reason] [ntext] NULL,
	[OfflinePayment] [nvarchar](50) NULL,
	[PO_Number] [nvarchar](30) NULL,
	[Notes] [ntext] NULL,
	[CustomerShippingNotes] [nvarchar](2000) NULL,
	[AdminUser_ID] [int] NOT NULL,
	[Admin_Updated] [datetime] NULL,
	[Admin_Name] [nvarchar](50) NULL,
	[AdminCredit] [float] NOT NULL,
	[AdminCreditText] [nvarchar](50) NULL,
	[Printed] [int] NOT NULL,
	[Printed_Inv] [bit] NOT NULL,
	[Printed_Pack] [bit] NOT NULL,
	[Printed_quote] [bit] NOT NULL,
	[Status] [nvarchar](50) NULL,
	[Paid] [bit] NOT NULL,
	[CodesSent] [bit] NOT NULL,
	[ID_Tag] [nvarchar](35) NULL,
	[TermsUsed] [ntext] NULL,
	[LastTransactNum] [nvarchar](500) NULL,
	[ShippingLabel] [nvarchar](100) NULL,
	[ReturnLabel] [nvarchar](100) NULL,
	[Actual_shipping] [float] NULL,
	[IsAddressVerified] [bit] NULL,
	[Source] [nvarchar](50) NULL,
	[SettingID] [int] NOT NULL,
	[Easypostshipmentid] [nvarchar](100) NULL,
	[Easypostshipmentid_return] [nvarchar](100) NULL,
	[QB_export] [bit] NOT NULL,
	[QB_Customer_ID] [int] NULL,
	[QBProcess] [bit] NULL,
	[OLD_orderID] [int] NULL,
	[Amazon_OrderID] [nvarchar](50) NULL,
	[Amazon_Order_Filled] [int] NOT NULL,
	[giftCertDisc] [float] NULL,
	[Ship_coup_code] [nvarchar](100) NULL,
	[ShippingDisc] [float] NULL,
	[Amazon_Fees] [float] NULL,
	[Subscribe_SMS_shipping] [bit] NOT NULL,
 CONSTRAINT [Order_No_Refund_PK] PRIMARY KEY NONCLUSTERED 
(
	[Order_No_Refund] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order_PO]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order_PO](
	[Order_PO_ID] [int] IDENTITY(1,1) NOT NULL,
	[Order_No] [int] NOT NULL,
	[PO_No] [nvarchar](30) NOT NULL,
	[Account_ID] [int] NOT NULL,
	[PrintDate] [datetime] NULL,
	[Notes] [nvarchar](255) NULL,
	[PO_Shipto] [int] NOT NULL,
	[PO_Status] [nvarchar](50) NULL,
	[PO_Open] [bit] NOT NULL,
	[EmailAcknowledgedDate] [datetime] NULL,
	[ShipDate] [datetime] NULL,
	[Shipper] [nvarchar](50) NULL,
	[Tracking] [nvarchar](500) NULL,
	[ID_Tag] [nvarchar](35) NULL,
 CONSTRAINT [Order_PO_PK] PRIMARY KEY NONCLUSTERED 
(
	[Order_PO_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[orders_email]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[orders_email](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[email] [nvarchar](255) NOT NULL,
	[notes] [nvarchar](max) NULL,
	[order_no] [int] NULL,
	[enterdate] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderSettings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderSettings](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[SettingID] [int] NOT NULL,
	[AllowPO] [int] NOT NULL,
	[AllowQuote] [int] NOT NULL,
	[AllowInt] [bit] NOT NULL,
	[AllowOffline] [bit] NOT NULL,
	[OnlyOffline] [bit] NOT NULL,
	[OfflineMessage] [ntext] NULL,
	[CCProcess] [nvarchar](50) NULL,
	[CCProcessID] [int] NOT NULL,
	[useACH] [bit] NOT NULL,
	[EmailAdmin] [bit] NOT NULL,
	[EmailUser] [bit] NOT NULL,
	[EmailAffs] [bit] NOT NULL,
	[EmailDrop] [bit] NOT NULL,
	[OrderEmail] [nvarchar](250) NULL,
	[DropEmail] [nvarchar](250) NULL,
	[EmailDropWhen] [nvarchar](15) NOT NULL,
	[Giftcard] [bit] NOT NULL,
	[Delivery] [bit] NOT NULL,
	[Coupons] [bit] NOT NULL,
	[Backorders] [bit] NOT NULL,
	[BaseOrderNum] [int] NOT NULL,
	[StoreCardInfo] [bit] NOT NULL,
	[MinTotal] [int] NOT NULL,
	[MinTotal_wholesale] [int] NOT NULL,
	[CustomText1] [nvarchar](255) NULL,
	[CustomText2] [nvarchar](255) NULL,
	[CustomText3] [nvarchar](255) NULL,
	[CustomSelect1] [nvarchar](100) NULL,
	[CustomSelect2] [nvarchar](100) NULL,
	[CustomChoices1] [ntext] NULL,
	[CustomChoices2] [ntext] NULL,
	[CustomText_Req] [nvarchar](50) NULL,
	[CustomSelect_Req] [nvarchar](50) NULL,
	[ShowTermsInCheckout] [bit] NOT NULL,
	[AgreeTerms] [ntext] NULL,
	[Giftwrap] [bit] NOT NULL,
	[UseCVV2] [bit] NOT NULL,
	[NoGuests] [bit] NOT NULL,
	[UseBilling] [bit] NOT NULL,
	[ShowBasket] [bit] NOT NULL,
	[ShowSFL] [bit] NOT NULL,
	[ShowRAC] [bit] NOT NULL,
	[SkipAddressForm] [bit] NOT NULL,
	[UsePayPal] [bit] NOT NULL,
	[PayPalClientID] [nvarchar](100) NULL,
	[PayPalSecret] [nvarchar](100) NULL,
	[PayPalLog] [bit] NOT NULL,
	[PayPalMethod] [nvarchar](25) NULL,
	[PDT_Token] [nvarchar](100) NULL,
	[PayPalServer] [nvarchar](100) NULL,
	[PayPalEmail] [nvarchar](100) NULL,
	[TaxMethod] [int] NOT NULL,
	[AllowGoogleAutoComplete] [bit] NOT NULL,
	[AllowGoogleValidateAddress] [bit] NOT NULL,
	[AllowBadAddress] [bit] NOT NULL,
 CONSTRAINT [OrderSettings_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderTaxes]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderTaxes](
	[Order_No] [int] NOT NULL,
	[Code_ID] [int] NOT NULL,
	[ProductTotal] [float] NOT NULL,
	[CodeName] [nvarchar](50) NULL,
	[AddressUsed] [nvarchar](20) NULL,
	[AllUserTax] [float] NOT NULL,
	[StateTax] [float] NOT NULL,
	[CountyTax] [float] NOT NULL,
	[LocalTax] [float] NOT NULL,
	[CountryTax] [float] NOT NULL,
 CONSTRAINT [OrderTaxes_PK] PRIMARY KEY NONCLUSTERED 
(
	[Order_No] ASC,
	[Code_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Pages]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Pages](
	[Page_ID] [int] NOT NULL,
	[Page_URL] [nvarchar](250) NULL,
	[CatCore_ID] [int] NULL,
	[PassParam] [nvarchar](100) NULL,
	[Display] [bit] NOT NULL,
	[Display_Menu] [bit] NOT NULL,
	[Display_Mobile] [bit] NOT NULL,
	[PageAction] [nvarchar](30) NULL,
	[Page_Name] [nvarchar](100) NOT NULL,
	[Page_Title] [nvarchar](75) NULL,
	[Sm_Image] [nvarchar](100) NULL,
	[Lg_Image] [nvarchar](100) NULL,
	[Sm_image_width] [int] NULL,
	[Sm_image_height] [int] NULL,
	[Lg_image_width] [int] NULL,
	[Lg_image_height] [int] NULL,
	[Sm_Title] [nvarchar](100) NULL,
	[Lg_Title] [nvarchar](100) NULL,
	[Color_ID] [int] NULL,
	[Short_desc] [nvarchar](4000) NULL,
	[PageText] [ntext] NULL,
	[ShowTextFirst] [bit] NOT NULL,
	[System] [bit] NOT NULL,
	[Href_Attributes] [nvarchar](50) NULL,
	[AccessKey] [int] NULL,
	[Priority] [int] NULL,
	[Parent_ID] [int] NULL,
	[Title_Priority] [int] NULL,
	[Metadescription] [nvarchar](255) NULL,
	[Keywords] [nvarchar](255) NULL,
	[TitleTag] [nvarchar](255) NULL,
	[Permalink] [nvarchar](1000) NULL,
	[Custom_include] [nvarchar](255) NULL,
 CONSTRAINT [Pages_PK] PRIMARY KEY CLUSTERED 
(
	[Page_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Payment]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Payment](
	[Payment_ID] [int] IDENTITY(1,1) NOT NULL,
	[Order_No] [int] NULL,
	[Amount] [float] NOT NULL,
	[CardData_ID] [int] NULL,
	[OfflinePayment] [nvarchar](50) NULL,
	[AuthNumber] [nvarchar](150) NULL,
	[TransactNum] [nvarchar](150) NULL,
	[InvoiceNum] [nvarchar](150) NULL,
	[PaymentDateTime] [datetime] NOT NULL,
	[Voided] [bit] NOT NULL,
	[ExpressRefunded] [tinyint] NOT NULL,
	[Notes] [nvarchar](2000) NULL,
	[PayPalStatus] [nvarchar](100) NULL,
	[Token1] [nvarchar](50) NULL,
	[Token2] [nvarchar](50) NULL,
	[Token_expiration] [datetime] NULL,
	[ACH_ID] [int] NULL,
	[OrgAmount] [float] NOT NULL,
	[status] [nvarchar](100) NULL,
	[Source] [varchar](250) NULL,
	[SettingID] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Permission_Groups]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Permission_Groups](
	[Group_ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](20) NOT NULL,
 CONSTRAINT [Permission_Groups_PK] PRIMARY KEY NONCLUSTERED 
(
	[Group_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Permissions]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Permissions](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Group_ID] [int] NOT NULL,
	[Name] [nvarchar](30) NOT NULL,
	[BitValue] [int] NULL,
 CONSTRAINT [Permissions_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PickLists]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PickLists](
	[Picklist_ID] [int] IDENTITY(1,1) NOT NULL,
	[Feature_Type] [ntext] NULL,
	[Acc_Rep] [ntext] NULL,
	[Acc_Type1] [ntext] NULL,
	[Acc_Descr1] [ntext] NULL,
	[Product_Availability] [ntext] NULL,
	[Shipping_Status] [ntext] NULL,
	[PO_Status] [ntext] NULL,
	[GiftRegistry_Type] [ntext] NULL,
	[Review_Editorial] [ntext] NULL,
	[Product_listing] [ntext] NULL,
	[Category_listing] [ntext] NULL,
	[Search_header] [ntext] NULL,
	[Side_Menu_Style] [ntext] NULL,
	[SubCat_Menu_Style] [ntext] NULL,
	[Unit_Desc] [ntext] NULL,
 CONSTRAINT [PickLists_PK] PRIMARY KEY CLUSTERED 
(
	[Picklist_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[POS_settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[POS_settings](
	[ID] [int] NOT NULL,
	[Display] [bit] NOT NULL,
	[POScategory0] [int] NULL,
	[POScategory1] [int] NULL,
	[TradeInCategory] [int] NULL,
	[CreditProduct] [int] NULL,
	[GiftCertificateProduct] [int] NULL,
	[DefaultTradeIn] [int] NULL,
	[DefaultCustomer] [int] NULL,
	[DefaultState] [nvarchar](50) NULL,
	[DefaultZip] [nvarchar](50) NULL,
	[PayInvoiceProduct_id] [int] NOT NULL,
	[PayInvoiceAddon1] [int] NOT NULL,
	[PayInvoiceAddon2] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Prod_CustInfo]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Prod_CustInfo](
	[Product_ID] [int] NOT NULL,
	[Custom_ID] [int] NOT NULL,
	[CustomInfo] [nvarchar](150) NULL,
 CONSTRAINT [Prod_CustInfo_PK] PRIMARY KEY NONCLUSTERED 
(
	[Product_ID] ASC,
	[Custom_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Prod_CustomFields]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Prod_CustomFields](
	[Custom_ID] [int] NOT NULL,
	[Custom_Name] [nvarchar](50) NULL,
	[Custom_Display] [bit] NOT NULL,
	[Google_Use] [bit] NOT NULL,
	[Google_Code] [nvarchar](50) NULL,
 CONSTRAINT [Prod_CustomFields_PK] PRIMARY KEY CLUSTERED 
(
	[Custom_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Prod_SKU_Combos]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Prod_SKU_Combos](
	[Combo_ID] [int] IDENTITY(1,1) NOT NULL,
	[SKU_ID] [int] NOT NULL,
	[Option_ID] [int] NOT NULL,
	[Choice_ID] [int] NOT NULL,
	[Parent_ID] [int] NOT NULL,
	[SortOrder] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Combo_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProdAddons]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProdAddons](
	[Addon_ID] [int] IDENTITY(1,1) NOT NULL,
	[Product_ID] [int] NOT NULL,
	[ProductOptionId] [int] NULL,
	[Standard_ID] [int] NOT NULL,
	[addon_stdid] [int] NOT NULL,
	[Prompt] [nvarchar](150) NULL,
	[AddonDesc] [nvarchar](100) NULL,
	[AddonMessage] [nvarchar](500) NULL,
	[AddonType] [nvarchar](10) NULL,
	[Display] [bit] NOT NULL,
	[Priority] [int] NOT NULL,
	[Price] [float] NULL,
	[Price_Wholesale] [float] NULL,
	[Weight] [float] NULL,
	[ProdMult] [bit] NOT NULL,
	[Required] [bit] NOT NULL,
 CONSTRAINT [ProdAddons_PK] PRIMARY KEY CLUSTERED 
(
	[Addon_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProdDisc]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProdDisc](
	[Product_ID] [int] NOT NULL,
	[ProdDisc_ID] [int] NOT NULL,
	[Wholesale] [bit] NOT NULL,
	[QuantFrom] [int] NOT NULL,
	[QuantTo] [int] NOT NULL,
	[DiscountPer] [float] NOT NULL,
	[Type] [bit] NOT NULL,
	[Display] [bit] NOT NULL,
 CONSTRAINT [ProdDisc_PK] PRIMARY KEY CLUSTERED 
(
	[Product_ID] ASC,
	[ProdDisc_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProdGrpPrice]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProdGrpPrice](
	[Product_ID] [int] NOT NULL,
	[GrpPrice_ID] [int] NOT NULL,
	[Group_ID] [int] NOT NULL,
	[Price] [float] NOT NULL,
 CONSTRAINT [ProdGrpPrice_PK] PRIMARY KEY CLUSTERED 
(
	[Product_ID] ASC,
	[GrpPrice_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProdInfo]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProdInfo](
	[Product_ID] [int] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Category_ID] [int] NOT NULL,
	[SKU] [nvarchar](50) NULL,
	[Long_desc] [ntext] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProdOpt_Choices]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProdOpt_Choices](
	[Option_ID] [int] NOT NULL,
	[Choice_ID] [int] NOT NULL,
	[ChoiceName] [nvarchar](150) NULL,
	[Sm_image1] [nvarchar](250) NULL,
	[Sm_image2] [nvarchar](250) NULL,
	[Sm_image3] [nvarchar](250) NULL,
	[Sm_image4] [nvarchar](250) NULL,
	[Md_image1] [nvarchar](250) NULL,
	[Md_image2] [nvarchar](250) NULL,
	[Md_image3] [nvarchar](250) NULL,
	[Md_image4] [nvarchar](250) NULL,
	[Lg_image1] [nvarchar](250) NULL,
	[Lg_image2] [nvarchar](250) NULL,
	[Lg_image3] [nvarchar](250) NULL,
	[Lg_image4] [nvarchar](250) NULL,
	[Price] [float] NOT NULL,
	[Price_Wholesale] [float] NULL,
	[Weight] [float] NOT NULL,
	[SKU] [nvarchar](50) NULL,
	[UPC] [nvarchar](50) NULL,
	[ALU] [nvarchar](50) NULL,
	[NumInStock] [int] NULL,
	[Display] [bit] NOT NULL,
	[SortOrder] [int] NULL,
	[ParentOptionChoiceID] [int] NULL,
	[optionTextColor] [nvarchar](10) NULL,
 CONSTRAINT [ProdOpt_Choices_PK] PRIMARY KEY NONCLUSTERED 
(
	[Option_ID] ASC,
	[Choice_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[prodtypeparam_answer_map]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[prodtypeparam_answer_map](
	[MapId] [bigint] IDENTITY(1,1) NOT NULL,
	[Param_ID] [bigint] NOT NULL,
	[AnswerId] [bigint] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[MapId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[prodtypeparam_answers]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[prodtypeparam_answers](
	[AnswerId] [bigint] IDENTITY(1,1) NOT NULL,
	[Answers] [varchar](150) NULL,
	[Priority] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[AnswerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[prodtypeparam_product]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[prodtypeparam_product](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Product_ID] [bigint] NULL,
	[ProdTypeParam_ID] [bigint] NULL,
	[ParamValue] [varchar](255) NULL,
	[AnswerId] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[prodtypeparams]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[prodtypeparams](
	[ProdTypeParam_ID] [bigint] NOT NULL,
	[ProdType_ID] [bigint] NOT NULL,
	[Name] [varchar](75) NOT NULL,
	[Question] [varchar](255) NULL,
	[Answers] [varchar](max) NOT NULL,
	[Priority] [bigint] NULL,
	[Display] [bit] NULL,
	[Parent_id] [int] NULL,
	[Answer_id] [int] NULL,
	[AlwaysOpen] [bit] NULL,
	[AllowMultipleChoice] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[ProdTypeParam_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[prodtypes]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[prodtypes](
	[ProdType_ID] [bigint] NOT NULL,
	[TypeName] [varchar](50) NULL,
	[Shippable] [smallint] NULL,
	[Downloadable] [smallint] NULL,
	[Membership] [smallint] NULL,
	[GroupPricing] [smallint] NULL,
	[QuantityDiscounts] [smallint] NULL,
	[Options] [smallint] NULL,
	[Addons] [smallint] NULL,
	[Images] [smallint] NULL,
	[Specifications] [smallint] NULL,
	[AdvSearch] [smallint] NULL,
	[Reviewable] [smallint] NULL,
	[Personalization] [smallint] NULL,
	[Performance] [smallint] NULL,
	[Listing] [smallint] NULL,
PRIMARY KEY CLUSTERED 
(
	[ProdType_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[prodtypespec_product]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[prodtypespec_product](
	[ID] [bigint] IDENTITY(1,1) NOT NULL,
	[Product_ID] [bigint] NULL,
	[ProdTypeSpec_ID] [bigint] NULL,
	[SpecValue] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[prodtypespecs]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[prodtypespecs](
	[ProdTypeSpec_ID] [bigint] NOT NULL,
	[ProdType_ID] [bigint] NULL,
	[Name] [varchar](50) NOT NULL,
	[IsTitle] [smallint] NULL,
	[Priority] [bigint] NULL,
	[IsGoogle] [smallint] NULL,
PRIMARY KEY CLUSTERED 
(
	[ProdTypeSpec_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product_Category]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product_Category](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Category_ID] [int] NOT NULL,
 CONSTRAINT [Product_Category_PK] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product_files]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product_files](
	[File_id] [int] IDENTITY(1,1) NOT NULL,
	[Product_id] [int] NOT NULL,
	[Category_id] [int] NOT NULL,
	[Filename] [nvarchar](250) NULL,
	[Mimetype] [nvarchar](150) NULL,
	[Filepath] [nvarchar](1000) NULL,
	[Filecontent] [varbinary](max) NULL,
	[Filesize] [nvarchar](50) NULL,
	[Description] [nvarchar](500) NULL,
	[Priority] [int] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product_Images]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product_Images](
	[Product_Image_ID] [int] IDENTITY(1,1) NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Original] [nvarchar](500) NULL,
	[Th_image] [nvarchar](500) NULL,
	[Sm_image] [nvarchar](500) NULL,
	[Md_image] [nvarchar](500) NULL,
	[Lg_image] [nvarchar](500) NULL,
	[th_image_width] [int] NULL,
	[th_image_height] [int] NULL,
	[sm_image_width] [int] NULL,
	[sm_image_height] [int] NULL,
	[md_image_width] [int] NULL,
	[md_image_height] [int] NULL,
	[Lg_image_width] [int] NULL,
	[Lg_image_height] [int] NULL,
	[FileName] [nvarchar](500) NULL,
	[Image_File] [nvarchar](500) NULL,
	[Gallery] [nvarchar](50) NULL,
	[Caption] [nvarchar](100) NULL,
	[Priority] [int] NULL,
	[RenameImg] [nvarchar](500) NULL,
 CONSTRAINT [Product_Images_PK] PRIMARY KEY NONCLUSTERED 
(
	[Product_Image_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product_Item]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product_Item](
	[Product_Item_ID] [int] IDENTITY(1,1) NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Item_ID] [int] NOT NULL,
 CONSTRAINT [Product_Item_PK] PRIMARY KEY NONCLUSTERED 
(
	[Product_Item_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product_Options]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product_Options](
	[Option_ID] [int] IDENTITY(1,1) NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Std_ID] [int] NOT NULL,
	[Prompt] [nvarchar](250) NULL,
	[OptDesc] [nvarchar](50) NULL,
	[ShowPrice] [nvarchar](10) NULL,
	[Display] [bit] NOT NULL,
	[ColorDisplay] [int] NOT NULL,
	[UseOptImageInCart] [bit] NOT NULL,
	[IsParent] [tinyint] NOT NULL,
	[Text] [nvarchar](2000) NULL,
	[Priority] [int] NULL,
	[TrackInv] [bit] NOT NULL,
	[Required] [bit] NOT NULL,
 CONSTRAINT [Product_Options_PK] PRIMARY KEY CLUSTERED 
(
	[Option_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product_Package]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product_Package](
	[Package_id] [int] IDENTITY(1,1) NOT NULL,
	[Parent_id] [int] NOT NULL,
	[DynamicPricing] [bit] NOT NULL,
	[showImage] [bit] NOT NULL,
	[showPrice] [bit] NOT NULL,
	[showSKU] [bit] NOT NULL,
	[showDesc] [bit] NOT NULL,
	[showQty] [bit] NOT NULL,
	[Min_order] [int] NOT NULL,
	[Max_order] [int] NOT NULL,
	[optionsOnly] [bit] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product_Package_Products]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product_Package_Products](
	[Package_id] [int] NOT NULL,
	[Product_id] [int] NOT NULL,
	[Priority] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product_SKUs]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product_SKUs](
	[SKU_ID] [int] IDENTITY(1,1) NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Display] [bit] NOT NULL,
	[Override] [bit] NOT NULL,
	[SortOrder] [int] NULL,
	[NumInStock] [int] NULL,
	[Weight] [float] NOT NULL,
	[Price] [float] NOT NULL,
	[Price_on_Amazon] [float] NULL,
	[Amazon_Price] [float] NULL,
	[Amazon_BuyButton_Price] [float] NULL,
	[SKU] [varchar](50) NULL,
	[ALU] [nvarchar](50) NULL,
	[UPC] [nvarchar](50) NULL,
	[ASIN] [nvarchar](50) NULL,
	[noSellerSKU] [bit] NULL,
	[noASIN] [bit] NULL,
	[noListingCount] [bit] NULL,
	[Active] [int] NOT NULL,
	[Store_Inventory_on_Amazon] [int] NULL,
	[Amazon_Inventory] [int] NULL,
	[Message] [nvarchar](2000) NULL,
	[Suppressed_Message] [nvarchar](1000) NULL,
	[Amazon_Inventory_Last_Updated] [datetime] NULL,
	[batch_id] [nvarchar](50) NULL,
	[ImageSwap] [varchar](150) NULL,
	[EAN] [nvarchar](500) NULL,
 CONSTRAINT [Product_SKUs__FK] PRIMARY KEY CLUSTERED 
(
	[SKU_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Product_videos]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product_videos](
	[video_id] [int] IDENTITY(1,1) NOT NULL,
	[product_id] [int] NOT NULL,
	[original] [varchar](300) NULL,
	[name] [nvarchar](50) NULL,
	[lg_image] [nvarchar](300) NULL,
	[sm_image] [nvarchar](300) NULL,
	[priority] [int] NOT NULL,
	[description] [nvarchar](500) NULL,
	[DateAdded] [datetime] NULL,
	[video_mp4] [nvarchar](300) NULL,
	[video_webm] [nvarchar](300) NULL,
	[video_ogg] [nvarchar](300) NULL,
	[video_external] [nvarchar](500) NULL,
	[video_width] [int] NULL,
	[video_height] [int] NULL,
 CONSTRAINT [PK_Product_videos] PRIMARY KEY CLUSTERED 
(
	[video_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductReviews]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductReviews](
	[Review_ID] [int] IDENTITY(1,1) NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Order_no] [int] NOT NULL,
	[User_ID] [int] NULL,
	[Anonymous] [bit] NOT NULL,
	[Anon_Name] [nvarchar](50) NULL,
	[Anon_Loc] [nvarchar](50) NULL,
	[Anon_Email] [nvarchar](75) NULL,
	[Editorial] [nvarchar](50) NULL,
	[Title] [nvarchar](75) NOT NULL,
	[Comment] [ntext] NOT NULL,
	[Rating] [int] NOT NULL,
	[Recommend] [bit] NOT NULL,
	[Posted] [datetime] NOT NULL,
	[Updated] [datetime] NULL,
	[Approved] [bit] NOT NULL,
	[NeedsCheck] [bit] NOT NULL,
	[Helpful_Total] [int] NOT NULL,
	[Helpful_Yes] [int] NOT NULL,
 CONSTRAINT [ProductReviews_PK] PRIMARY KEY NONCLUSTERED 
(
	[Review_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductReviews_ContactCount]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductReviews_ContactCount](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Order_no] [int] NOT NULL,
	[Product_id] [int] NOT NULL,
	[Contact_type] [nvarchar](100) NULL,
	[DateCreated] [datetime] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductReviewsHelpful]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductReviewsHelpful](
	[Helpful_ID] [nvarchar](35) NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Review_ID] [int] NOT NULL,
	[Helpful] [bit] NOT NULL,
	[User_ID] [int] NULL,
	[Date_Stamp] [datetime] NULL,
	[IP] [nvarchar](30) NULL,
 CONSTRAINT [ProductReviewsHelpful_PK] PRIMARY KEY NONCLUSTERED 
(
	[Helpful_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[Product_ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](1000) NOT NULL,
	[Short_Desc] [ntext] NULL,
	[Long_Desc] [ntext] NULL,
	[Long_Desc_title] [nvarchar](150) NULL,
	[Long_Desc_position] [int] NOT NULL,
	[Content_style] [int] NOT NULL,
	[Long_Desc2] [ntext] NULL,
	[Long_Desc2_title] [nvarchar](150) NULL,
	[Long_Desc3] [ntext] NULL,
	[Long_Desc3_title] [nvarchar](150) NULL,
	[Long_Desc4] [ntext] NULL,
	[Long_Desc4_title] [nvarchar](150) NULL,
	[Bullet_point1] [nvarchar](500) NULL,
	[Bullet_point2] [nvarchar](500) NULL,
	[Bullet_point3] [nvarchar](500) NULL,
	[Bullet_point4] [nvarchar](500) NULL,
	[Bullet_point5] [nvarchar](500) NULL,
	[SKU] [nvarchar](50) NULL,
	[UPC] [nvarchar](50) NULL,
	[ALU] [nvarchar](50) NULL,
	[Vendor_SKU] [nvarchar](50) NULL,
	[Retail_Price] [float] NULL,
	[Base_Price] [float] NOT NULL,
	[Wholesale] [float] NOT NULL,
	[MAP_Price] [float] NOT NULL,
	[Dropship_Cost] [float] NULL,
	[Item_handling] [float] NULL,
	[Unit_desc] [nvarchar](50) NULL,
	[Weight] [float] NULL,
	[Shipping] [bit] NOT NULL,
	[Shipping_Quote] [bit] NOT NULL,
	[Hazardous] [bit] NOT NULL,
	[TaxCodes] [nvarchar](50) NULL,
	[AccessKey] [int] NULL,
	[POSOnly] [bit] NOT NULL,
	[PackageOnly] [bit] NOT NULL,
	[Gallery_image_style] [int] NOT NULL,
	[Sm_Title] [nvarchar](100) NULL,
	[Lg_Title] [nvarchar](100) NULL,
	[PassParam] [nvarchar](100) NULL,
	[Color_ID] [int] NULL,
	[Display] [bit] NOT NULL,
	[Priority] [int] NOT NULL,
	[Popularity] [int] NOT NULL,
	[NumInStock] [int] NOT NULL,
	[ShowProdOnSub1] [int] NOT NULL,
	[CheckInventory1] [bit] NOT NULL,
	[ShowOrderBox] [bit] NOT NULL,
	[ShowPrice] [bit] NOT NULL,
	[ShowPriceRange] [bit] NOT NULL,
	[ShowDiscounts] [bit] NOT NULL,
	[ShowPromotions] [bit] NOT NULL,
	[ShowQuantity] [int] NOT NULL,
	[Highlight] [bit] NOT NULL,
	[NotSold] [bit] NOT NULL,
	[Reviewable] [bit] NOT NULL,
	[UseforPOTD] [bit] NOT NULL,
	[Sale] [bit] NOT NULL,
	[Hot] [bit] NOT NULL,
	[TotalSold] [int] NOT NULL,
	[DateAdded] [datetime] NULL,
	[OptQuant] [int] NOT NULL,
	[Reorder_Level] [int] NULL,
	[Min_Order] [int] NULL,
	[Mult_Min] [bit] NOT NULL,
	[Sale_Start] [datetime] NULL,
	[Sale_End] [datetime] NULL,
	[Stock_date] [datetime] NULL,
	[Stock_message] [varchar](255) NULL,
	[Discounts] [nvarchar](255) NULL,
	[Promotions] [nvarchar](255) NULL,
	[Account_ID] [int] NULL,
	[Mfg_Account_ID] [int] NULL,
	[Prod_Type] [nvarchar](50) NULL,
	[ProdType_ID] [int] NULL,
	[Subscription] [bit] NOT NULL,
	[Subscription_discount] [float] NOT NULL,
	[Product_Layout] [nvarchar](50) NULL,
	[Content_URL] [nvarchar](75) NULL,
	[MimeType] [nvarchar](50) NULL,
	[Access_Count] [int] NULL,
	[Num_Days] [int] NULL,
	[Prep_Days] [int] NOT NULL,
	[Access_Keys] [nvarchar](50) NULL,
	[Recur] [bit] NOT NULL,
	[Recur_Product_ID] [int] NULL,
	[VertOptions] [bit] NOT NULL,
	[Metadescription] [nvarchar](255) NULL,
	[Keywords] [nvarchar](255) NULL,
	[TitleTag] [nvarchar](255) NULL,
	[Permalink] [nvarchar](1000) NULL,
	[GiftWrap] [bit] NOT NULL,
	[Availability] [nvarchar](75) NULL,
	[Freight_Dom] [float] NULL,
	[Freight_Intl] [float] NULL,
	[Pack_Width] [float] NULL,
	[Pack_Height] [float] NULL,
	[Pack_Length] [float] NULL,
	[User_ID] [int] NULL,
	[Google_Brand] [nvarchar](100) NULL,
	[Google_gender] [nvarchar](10) NULL,
	[Google_age] [nvarchar](45) NULL,
	[Google_Condition] [nvarchar](100) NULL,
	[Google_Expire] [datetime] NULL,
	[Google_Prodtype] [nvarchar](100) NULL,
	[Google_product_category] [nvarchar](1000) NULL,
	[item_category] [nvarchar](100) NULL,
	[item_category2] [nvarchar](100) NULL,
	[item_category3] [nvarchar](100) NULL,
	[item_category4] [nvarchar](100) NULL,
	[item_category5] [nvarchar](100) NULL,
	[Hide_in_cart] [bit] NOT NULL,
	[Hs_tariff_number] [nvarchar](10) NULL,
	[Low_Opt_Price] [float] NULL,
	[Sell_on_Amazon] [bit] NOT NULL,
	[Amazon_Product_Type] [nvarchar](150) NULL,
	[Amazon_category_specific_xsd] [nvarchar](100) NULL,
	[Hide_in_admin] [tinyint] NOT NULL,
	[Hide_Date] [datetime] NULL,
	[Page_URL] [nvarchar](500) NULL,
	[AllowDropShip] [tinyint] NOT NULL,
	[DropShip_Note] [nvarchar](2000) NULL,
	[LsItemMatrixId] [bigint] NOT NULL,
	[lsUpdateDate] [datetime] NULL,
	[C22Yrs] [text] NULL,
	[C25Yrs] [text] NULL,
	[C22HBitem] [text] NULL,
	[C25HBitem] [text] NULL,
	[Handbook_Descrp] [nvarchar](1000) NULL,
	[NobuyMessage] [int] NOT NULL,
	[RelatedProducts_title] [nvarchar](255) NULL,
	[AddCrate] [bit] NOT NULL,
	[QuickCheckoutOnly] [bit] NOT NULL,
	[ShowBuyMessage] [int] NOT NULL,
	[Highlight2] [bit] NOT NULL,
	[FAQ_list] [nvarchar](100) NULL,
	[Weight2] [float] NULL,
	[Pack_Width2] [float] NULL,
	[Pack_Height2] [float] NULL,
	[Pack_Length2] [float] NULL,
	[Weight3] [float] NULL,
	[Pack_Width3] [float] NULL,
	[Pack_Height3] [float] NULL,
	[Pack_Length3] [float] NULL,
	[Weight4] [float] NULL,
	[Pack_Width4] [float] NULL,
	[Pack_Height4] [float] NULL,
	[Pack_Length4] [float] NULL,
	[Add_Additional_Handling] [bit] NOT NULL,
 CONSTRAINT [Products_PK] PRIMARY KEY CLUSTERED 
(
	[Product_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Promotion_Groups]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Promotion_Groups](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Promotion_ID] [int] NOT NULL,
	[Group_ID] [int] NOT NULL,
 CONSTRAINT [Promotion_Groups_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Promotion_Qual_Products]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Promotion_Qual_Products](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Promotion_ID] [int] NOT NULL,
	[Product_ID] [int] NOT NULL,
 CONSTRAINT [Promotion_Qual_Products_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Promotions]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Promotions](
	[Promotion_ID] [int] IDENTITY(1,1) NOT NULL,
	[Type1] [int] NOT NULL,
	[Type2] [int] NOT NULL,
	[Type3] [int] NOT NULL,
	[Type4] [int] NOT NULL,
	[Coup_Code] [nvarchar](50) NULL,
	[OneTime] [bit] NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
	[Display] [nvarchar](255) NULL,
	[Amount] [float] NOT NULL,
	[QualifyNum] [float] NOT NULL,
	[QualifyNumMax] [float] NOT NULL,
	[DiscountNum] [float] NOT NULL,
	[Multiply] [bit] NOT NULL,
	[StartDate] [datetime] NULL,
	[EndDate] [datetime] NULL,
	[Disc_Product] [int] NOT NULL,
	[Add_DiscProd] [bit] NOT NULL,
	[AccessKey] [int] NULL,
 CONSTRAINT [Promotions_PK] PRIMARY KEY CLUSTERED 
(
	[Promotion_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QB_Settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QB_Settings](
	[QB_ID] [int] IDENTITY(1,1) NOT NULL,
	[QBConsumerKey] [nvarchar](2000) NULL,
	[QBConsumerSecret] [nvarchar](2000) NULL,
	[QBAccessToken] [nvarchar](2000) NULL,
	[QBAccessTokenSecret] [nvarchar](2000) NULL,
	[QBCallBackUrl] [nvarchar](2000) NULL,
	[QBApiUrl] [nvarchar](2000) NULL,
	[QBtestenv] [nvarchar](50) NULL,
	[realmId] [nvarchar](50) NULL,
	[Transtype] [nvarchar](50) NOT NULL,
	[reconnectResp] [nvarchar](500) NULL,
	[enterdate] [datetime] NULL,
	[QBtype] [bit] NOT NULL,
	[QBAutoImport] [bit] NULL,
	[TaxCodeName] [nvarchar](100) NULL,
	[TaxCodeId] [nvarchar](20) NULL,
	[DepositCodeName] [nvarchar](100) NULL,
	[DepositCodeId] [nvarchar](20) NULL,
	[DiscountCodeName] [nvarchar](100) NULL,
	[DiscountCodeId] [nvarchar](20) NULL,
	[VisaCodeName] [nvarchar](100) NULL,
	[VisaCodeId] [nvarchar](20) NULL,
	[MasterCardCodeName] [nvarchar](100) NULL,
	[MasterCardCodeId] [nvarchar](20) NULL,
	[AmexCodeName] [nvarchar](100) NULL,
	[AmexCodeId] [nvarchar](20) NULL,
	[DiscoverCodeName] [nvarchar](100) NULL,
	[DiscoverCodeId] [nvarchar](20) NULL,
	[DNCodeName] [nvarchar](100) NULL,
	[DNCodeId] [nvarchar](20) NULL,
	[CKCodeName] [nvarchar](100) NULL,
	[CKCodeId] [nvarchar](20) NULL,
	[CashCodeName] [nvarchar](100) NULL,
	[CashCodeId] [nvarchar](20) NULL,
	[OtherCodeName] [nvarchar](100) NULL,
	[OtherCodeId] [nvarchar](20) NULL,
	[NucomClientKey] [nvarchar](50) NULL,
	[NucomClientSecret] [nvarchar](100) NULL,
	[NucomAPIKey] [nvarchar](100) NULL,
	[CFWebstoreURL] [nvarchar](100) NULL,
	[NucomAccessToken] [nvarchar](500) NULL,
	[NucomServicesURL] [nvarchar](250) NULL,
	[QBClientId] [nvarchar](250) NULL,
	[QBClientSecret] [nvarchar](250) NULL,
	[QBScope] [nvarchar](250) NULL,
	[QBRedirectUrl] [nvarchar](250) NULL,
	[QBRefreshToken] [nvarchar](250) NULL,
	[Error] [nvarchar](250) NULL,
	[ErrorDesc] [nvarchar](250) NULL,
 CONSTRAINT [QB_Settings_PK] PRIMARY KEY CLUSTERED 
(
	[QB_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QuickCheckout_settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuickCheckout_settings](
	[ID] [int] NOT NULL,
	[Display] [bit] NOT NULL,
	[POScategory0] [int] NULL,
	[POScategory1] [int] NULL,
	[TradeInCategory] [int] NULL,
	[CreditProduct] [int] NULL,
	[GiftCertificateProduct] [int] NULL,
	[DefaultTradeIn] [int] NULL,
	[DefaultCustomer] [int] NULL,
	[DefaultState] [nvarchar](50) NULL,
	[DefaultZip] [nvarchar](50) NULL,
	[payinvoiceProduct_id] [int] NOT NULL,
	[PayInvoiceAddon1] [int] NULL,
	[PayInvoiceAddon2] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[responses]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[responses](
	[Response_ID] [int] IDENTITY(1,1) NOT NULL,
	[User_ID] [int] NULL,
	[SiteName] [nvarchar](50) NULL,
	[OriginURL] [nvarchar](255) NULL,
	[OriginTitle] [nvarchar](50) NULL,
	[ToEmail] [nvarchar](150) NULL,
	[ToEmailCC] [nvarchar](50) NULL,
	[ToEmailBCC] [nvarchar](255) NULL,
	[ToSubject] [nvarchar](255) NULL,
	[Attachment] [nvarchar](50) NULL,
	[FromIP] [nvarchar](50) NULL,
	[FromName] [nvarchar](75) NULL,
	[FromEmail] [nvarchar](150) NULL,
	[FromFFields] [nvarchar](max) NULL,
	[FromMessage] [nvarchar](max) NULL,
	[MsgRead] [bit] NULL,
	[Status] [varchar](50) NULL,
	[Notes] [nvarchar](max) NULL,
	[Created] [datetime] NULL,
	[Updated] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Search_terms]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Search_terms](
	[Term_ID] [int] IDENTITY(1,1) NOT NULL,
	[Search_term] [nvarchar](250) NULL,
	[Search_category] [int] NOT NULL,
	[Search_date] [datetime] NULL,
 CONSTRAINT [Term_PK] PRIMARY KEY CLUSTERED 
(
	[Term_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Settings](
	[SettingID] [int] IDENTITY(1,1) NOT NULL,
	[DomainName] [nvarchar](100) NULL,
	[SiteName] [nvarchar](100) NULL,
	[SiteNameAB] [nvarchar](50) NULL,
	[Address1] [nvarchar](50) NULL,
	[Address2] [nvarchar](50) NULL,
	[City] [nvarchar](50) NULL,
	[State] [nvarchar](50) NULL,
	[Postalcode] [nvarchar](50) NULL,
	[County] [nvarchar](50) NULL,
	[HomeCountry] [nvarchar](100) NULL,
	[Merchant] [nvarchar](1000) NULL,
	[Phone] [nvarchar](150) NULL,
	[Phone2] [nvarchar](150) NULL,
	[Phone3] [nvarchar](150) NULL,
	[Phone4] [nvarchar](150) NULL,
	[Phone5] [nvarchar](150) NULL,
	[Logo_desktop] [nvarchar](500) NULL,
	[Logo_mobile] [nvarchar](500) NULL,
	[Logo_print] [nvarchar](500) NULL,
	[Logo_desktop_width] [int] NULL,
	[Logo_desktop_height] [int] NULL,
	[Logo_mobile_width] [int] NULL,
	[Logo_mobile_height] [int] NULL,
	[Logo_print_width] [int] NULL,
	[Logo_print_height] [int] NULL,
	[Logo_desktop_stickey_width] [int] NULL,
	[Logo_desktop_stickey_height] [int] NULL,
	[Logo_desktop_stickey_data_width] [int] NULL,
	[Logo_desktop_stickey_data_height] [int] NULL,
	[MerchantEmail] [nvarchar](150) NULL,
	[Webmaster] [nvarchar](150) NULL,
	[DefaultImages] [nvarchar](100) NULL,
	[FilePath] [nvarchar](150) NULL,
	[MimeTypes] [nvarchar](2000) NULL,
	[AllowExtensions] [nvarchar](500) NULL,
	[TimeOffset] [int] NOT NULL,
	[MoneyUnit] [nvarchar](50) NULL,
	[WeightUnit] [nvarchar](50) NULL,
	[SizeUnit] [nvarchar](50) NULL,
	[InvLevel] [nvarchar](50) NULL,
	[UseInvTab] [bit] NOT NULL,
	[ShowInStock] [bit] NOT NULL,
	[OutofStock] [bit] NOT NULL,
	[ShowRetail] [bit] NOT NULL,
	[Wishlists] [bit] NOT NULL,
	[CColumns] [int] NOT NULL,
	[PColumns] [int] NOT NULL,
	[MaxProds] [int] NOT NULL,
	[ProdRoot] [int] NULL,
	[CachedProds] [bit] NOT NULL,
	[FeatureRoot] [int] NULL,
	[MaxFeatures] [int] NULL,
	[ItemSort] [nvarchar](50) NULL,
	[OrderButtonText] [nvarchar](50) NULL,
	[OrderButtonImage] [nvarchar](100) NULL,
	[RegistryButtonText] [nvarchar](50) NULL,
	[RegistryButtonImage] [nvarchar](100) NULL,
	[WishlistButtonText] [nvarchar](50) NULL,
	[WishlistButtonImage] [nvarchar](100) NULL,
	[ProductListingStyle] [nvarchar](250) NULL,
	[Product_show_shortDesc] [int] NOT NULL,
	[Product_show_orderBox] [int] NOT NULL,
	[Product_show_Ratings] [int] NOT NULL,
	[Product_show_Icons] [int] NOT NULL,
	[Product_show_details] [int] NOT NULL,
	[Product_show_SKU] [int] NOT NULL,
	[Product_show_customFields] [int] NOT NULL,
	[Product_image_height] [nvarchar](50) NULL,
	[Product_grid_style] [nvarchar](50) NULL,
	[ShowProductSubscriptions] [bit] NOT NULL,
	[CategoryListingStyle] [nvarchar](250) NULL,
	[SideMenuStyle] [nvarchar](250) NULL,
	[SubCatMenuStyle] [nvarchar](250) NULL,
	[SearchContent] [nvarchar](45) NULL,
	[ShowSearchCategories] [bit] NOT NULL,
	[Category_sm_image_width] [int] NOT NULL,
	[Category_sm_image_height] [int] NOT NULL,
	[Category_lg_image_width] [int] NOT NULL,
	[Category_lg_image_height] [int] NOT NULL,
	[Image_Quality] [int] NOT NULL,
	[Use_ImageMagick] [int] NOT NULL,
	[Category_image_height] [int] NOT NULL,
	[CollectionName] [nvarchar](50) NULL,
	[Locale] [nvarchar](30) NULL,
	[CurrExchange] [nvarchar](30) NULL,
	[CurrExLabel] [nvarchar](30) NULL,
	[Color_ID] [int] NULL,
	[MetaTitle] [nvarchar](255) NULL,
	[Metadescription] [nvarchar](255) NULL,
	[Keywords] [nvarchar](255) NULL,
	[Email_Server] [nvarchar](255) NULL,
	[Email_User] [nvarchar](255) NULL,
	[Email_Pass] [nvarchar](255) NULL,
	[Email_Port] [int] NULL,
	[Email_useSSL] [int] NULL,
	[Email_useTLS] [int] NULL,
	[Admin_New_Window] [bit] NOT NULL,
	[Default_Fuseaction] [nvarchar](50) NULL,
	[ExcludeIP] [nvarchar](50) NULL,
	[DBType] [nvarchar](50) NULL,
	[ServerType] [nvarchar](50) NULL,
	[GiftRegistry] [bit] NOT NULL,
	[DoNotDspProdsInOffCats] [bit] NOT NULL,
	[DoNotDspFeaturesInOffCats] [bit] NOT NULL,
	[OnePageCheckout] [bit] NOT NULL,
	[UseSES] [int] NOT NULL,
	[EditPermalink] [bit] NOT NULL,
	[UseSESDummyExtension] [bit] NOT NULL,
	[SESDummyExtension] [nvarchar](10) NULL,
	[UseAutocomplete] [bit] NOT NULL,
	[AllowWholesale] [bit] NOT NULL,
	[UseVerity] [bit] NOT NULL,
	[Use_Mailinglist] [int] NOT NULL,
	[ShowSource] [bit] NOT NULL,
	[ShowDropShip] [bit] NOT NULL,
	[Show_Amazon] [bit] NOT NULL,
	[StoreEmail] [nvarchar](50) NULL,
	[ProductReviews] [bit] NOT NULL,
	[ProductReview_Approve] [bit] NOT NULL,
	[ProductReview_Flag] [bit] NOT NULL,
	[ProductReview_Add] [int] NOT NULL,
	[ProductReview_Rate] [bit] NOT NULL,
	[ProductReviews_Page] [int] NOT NULL,
	[ProductReviews_SendDaysAfter] [int] NOT NULL,
	[FeatureReviews] [bit] NOT NULL,
	[FeatureReview_Add] [int] NOT NULL,
	[FeatureReview_Flag] [bit] NOT NULL,
	[FeatureReview_Approve] [bit] NOT NULL,
	[BlogReviews] [tinyint] NOT NULL,
	[BlogReview_Add] [int] NOT NULL,
	[BlogReview_Flag] [tinyint] NOT NULL,
	[BlogReview_Approve] [tinyint] NOT NULL,
	[th_image_width] [int] NOT NULL,
	[th_image_height] [int] NOT NULL,
	[sm_image_width] [int] NOT NULL,
	[sm_image_height] [int] NOT NULL,
	[md_image_width] [int] NOT NULL,
	[md_image_height] [int] NOT NULL,
	[lg_image_width] [int] NOT NULL,
	[lg_image_height] [int] NOT NULL,
	[Alert_display] [bit] NOT NULL,
	[Alert_message] [nvarchar](max) NULL,
	[LOGIN_SHOWONETIMECODE] [bit] NOT NULL,
	[turnstile_secret_key] [nvarchar](100) NULL,
	[turnstile_site_key] [nvarchar](100) NULL,
	[Pinterest_Site_Verification] [nvarchar](50) NULL,
	[PinterestEmail] [nvarchar](150) NULL,
	[PinterestTagID] [nvarchar](50) NULL,
	[FacebookAppID] [nvarchar](50) NULL,
	[FacebookClientID] [nvarchar](100) NULL,
	[Algolia_Application_ID] [nvarchar](50) NULL,
	[Algolia_Search_API_Key] [nvarchar](100) NULL,
	[Algolia_Product_Index] [nvarchar](255) NULL,
	[Algolia_Category_Index] [nvarchar](255) NULL,
	[Algolia_Article_Index] [nvarchar](255) NULL,
	[Algolia_Suggestion_Index] [nvarchar](255) NULL,
	[Algolia_site_verification] [nvarchar](255) NULL,
	[Algolia_ShowInstantSearch] [bit] NOT NULL,
	[Algolia_ShowAutoComplete] [bit] NOT NULL,
	[GoogleAPIKey] [nvarchar](100) NULL,
	[Google_site_verification] [nvarchar](150) NULL,
	[GoogleClientID] [nvarchar](150) NULL,
	[GoogleTrackingCode] [nvarchar](50) NULL,
	[GoogleTagManager] [nvarchar](50) NULL,
	[GoogleDomain] [nvarchar](100) NULL,
	[GoogleMapEmbed] [nvarchar](2000) NULL,
	[showcaptcha] [bit] NOT NULL,
	[captchaSiteKey] [nvarchar](150) NULL,
	[captchaSiteSecret] [nvarchar](150) NULL,
	[og_image] [nvarchar](150) NULL,
	[favicon] [nvarchar](250) NULL,
	[favicon2] [nvarchar](250) NULL,
	[favicon3] [nvarchar](250) NULL,
	[AC_recur] [int] NOT NULL,
	[AC_past] [int] NOT NULL,
	[Avalara_companycode] [nvarchar](50) NULL,
	[Homepage_id] [int] NOT NULL,
	[Footer_id] [int] NOT NULL,
	[Tax_id] [int] NOT NULL,
	[Topcat_id] [int] NOT NULL,
	[Warehouse_acct_id] [int] NOT NULL,
	[AppleAppID] [nvarchar](100) NULL,
	[RelatedProducts_title] [nvarchar](100) NULL,
 CONSTRAINT [Settings_PK] PRIMARY KEY CLUSTERED 
(
	[SettingID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Shipment]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Shipment](
	[Shipment_id] [int] IDENTITY(1,1) NOT NULL,
	[Order_no] [int] NULL,
	[Printed_Pack] [bit] NOT NULL,
	[CustomerShippingNotes] [nvarchar](1000) NULL,
	[Shipper] [nvarchar](50) NULL,
	[ShipType] [nvarchar](150) NULL,
	[Weight] [float] NULL,
	[Shipping] [float] NULL,
	[Actual_shipping] [float] NULL,
	[Freight] [float] NULL,
	[Tracking] [nvarchar](500) NULL,
	[ShippingLabel] [nvarchar](150) NULL,
	[EasyPostShipmentID] [nvarchar](150) NULL,
	[DateEntered] [date] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Shipment_Items]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Shipment_Items](
	[Shipment_id] [int] NULL,
	[Item_id] [int] NULL,
	[Quantity] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Shipping]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Shipping](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[MinOrder] [float] NOT NULL,
	[MaxOrder] [float] NOT NULL,
	[Amount] [float] NOT NULL,
	[table_ID] [int] NOT NULL,
 CONSTRAINT [Shipping_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ShipSettings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ShipSettings](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[ShipType] [nvarchar](50) NULL,
	[ShipBase] [float] NOT NULL,
	[MerchantZip] [nvarchar](10) NULL,
	[InStorePickup] [bit] NOT NULL,
	[AllowNoShip] [bit] NOT NULL,
	[NoShipMess] [ntext] NULL,
	[NoShipType] [nvarchar](50) NULL,
	[ShipHand] [float] NOT NULL,
	[Freeship_Min] [float] NULL,
	[Freeship_ShipIDs] [nvarchar](50) NULL,
	[FreeShipStates] [nvarchar](500) NULL,
	[FreeShipAmtFlag] [bit] NOT NULL,
	[FreeShipStateFlag] [bit] NOT NULL,
	[ShowEstimator] [bit] NOT NULL,
	[ShowFreight] [bit] NOT NULL,
	[ShowCustShipAccount] [bit] NOT NULL,
	[ShowShipFrom] [bit] NOT NULL,
	[ShowFrontEnd] [bit] NOT NULL,
	[UseDropShippers] [bit] NOT NULL,
	[SingleShipmentOnly] [bit] NOT NULL,
	[Flatrate] [float] NOT NULL,
	[Flatrate_min] [float] NOT NULL,
	[Flatrate_domestic] [int] NOT NULL,
	[OverrideFreight] [bit] NOT NULL,
	[ID_Tag] [nvarchar](35) NULL,
 CONSTRAINT [ShipSettings_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[short_url]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[short_url](
	[short_ID] [int] IDENTITY(1,1) NOT NULL,
	[target_URL] [nvarchar](250) NULL,
	[short_URL] [nvarchar](250) NULL,
	[click_count] [int] NOT NULL,
	[date_created] [date] NOT NULL,
	[date_last_clicked] [date] NULL,
	[date_expire] [date] NULL,
	[target] [bit] NOT NULL,
	[category] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[short_url_category]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[short_url_category](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SMSTexts]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SMSTexts](
	[SMSText_ID] [int] IDENTITY(1,1) NOT NULL,
	[SMSText_Name] [nvarchar](50) NULL,
	[SMSText_Message] [ntext] NULL,
	[Subscribe_SMS] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[SMSText_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Social_Media_Icons]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Social_Media_Icons](
	[SM_ID] [int] IDENTITY(1,1) NOT NULL,
	[SettingID] [int] NOT NULL,
	[Name] [nvarchar](150) NULL,
	[Link] [nvarchar](255) NULL,
	[Image] [nvarchar](150) NULL,
	[Color] [nvarchar](45) NULL,
	[ColorAlt] [nvarchar](45) NULL,
	[Class] [nvarchar](45) NULL,
	[Icon] [nvarchar](100) NULL,
	[Priority] [int] NOT NULL,
	[Display] [bit] NOT NULL,
 CONSTRAINT [Social_Media_Icons_PK] PRIMARY KEY CLUSTERED 
(
	[SM_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[States]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[States](
	[Abb] [nvarchar](2) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Display] [tinyint] NOT NULL,
 CONSTRAINT [States_PK] PRIMARY KEY CLUSTERED 
(
	[Abb] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StateTax]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StateTax](
	[Tax_ID] [int] IDENTITY(1,1) NOT NULL,
	[Code_ID] [int] NOT NULL,
	[State] [nvarchar](2) NOT NULL,
	[TaxRate] [float] NOT NULL,
	[TaxShip] [bit] NOT NULL,
 CONSTRAINT [StateTax_PK] PRIMARY KEY CLUSTERED 
(
	[Tax_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StdAddons]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StdAddons](
	[Std_ID] [int] IDENTITY(1,1) NOT NULL,
	[Std_Name] [nvarchar](50) NOT NULL,
	[Std_Prompt] [nvarchar](150) NOT NULL,
	[Std_Desc] [nvarchar](100) NULL,
	[Std_Message] [nvarchar](500) NULL,
	[Std_Type] [nvarchar](10) NOT NULL,
	[Std_Display] [bit] NOT NULL,
	[Std_Price] [float] NOT NULL,
	[Std_Price_Wholesale] [float] NOT NULL,
	[Std_Weight] [float] NOT NULL,
	[Std_ProdMult] [bit] NOT NULL,
	[Std_Required] [bit] NULL,
	[User_ID] [int] NULL,
 CONSTRAINT [StdAddons_PK] PRIMARY KEY NONCLUSTERED 
(
	[Std_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StdOpt_Choices]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StdOpt_Choices](
	[Std_ID] [int] NOT NULL,
	[Choice_ID] [int] NOT NULL,
	[ChoiceName] [nvarchar](150) NULL,
	[Sm_image1] [nvarchar](250) NULL,
	[Sm_image2] [nvarchar](250) NULL,
	[Sm_image3] [nvarchar](250) NULL,
	[Sm_image4] [nvarchar](250) NULL,
	[Md_image1] [nvarchar](250) NULL,
	[Md_image2] [nvarchar](250) NULL,
	[Md_image3] [nvarchar](250) NULL,
	[Md_image4] [nvarchar](250) NULL,
	[Lg_image1] [nvarchar](250) NULL,
	[Lg_image2] [nvarchar](250) NULL,
	[Lg_image3] [nvarchar](250) NULL,
	[Lg_image4] [nvarchar](250) NULL,
	[optionTextColor] [nvarchar](10) NULL,
	[Price] [float] NOT NULL,
	[Price_Wholesale] [float] NULL,
	[Weight] [float] NOT NULL,
	[Display] [bit] NOT NULL,
	[SortOrder] [int] NULL,
 CONSTRAINT [StdOpt_Choices_PK] PRIMARY KEY NONCLUSTERED 
(
	[Std_ID] ASC,
	[Choice_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StdOptions]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StdOptions](
	[Std_ID] [int] IDENTITY(1,1) NOT NULL,
	[Std_Name] [nvarchar](50) NOT NULL,
	[Std_Prompt] [nvarchar](250) NOT NULL,
	[Std_Desc] [nvarchar](50) NULL,
	[Std_ShowPrice] [nvarchar](10) NOT NULL,
	[Std_Display] [bit] NOT NULL,
	[Std_ColorDisplay] [int] NOT NULL,
	[Std_Text] [nvarchar](2000) NULL,
	[Std_Required] [bit] NOT NULL,
	[Std_UseOptImageIncart] [bit] NOT NULL,
	[User_ID] [int] NULL,
 CONSTRAINT [StdOptions_PK] PRIMARY KEY NONCLUSTERED 
(
	[Std_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Subscription_Order_Items]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Subscription_Order_Items](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[User_ID] [int] NOT NULL,
	[Order_No] [int] NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Name] [nvarchar](255) NULL,
	[Options] [nvarchar](2000) NULL,
	[Addons] [nvarchar](2000) NULL,
	[AddonMultP] [float] NULL,
	[AddonNonMultP] [float] NULL,
	[Original_Price] [float] NOT NULL,
	[Quantity] [int] NOT NULL,
	[OptPrice] [float] NOT NULL,
	[sm_image] [nvarchar](250) NULL,
	[SKU] [nvarchar](100) NULL,
	[ALU] [nvarchar](100) NULL,
	[UPC] [nvarchar](100) NULL,
	[OptQuant] [int] NOT NULL,
	[OptChoice] [int] NULL,
	[OptionID_List] [nvarchar](255) NULL,
	[ChoiceID_List] [nvarchar](255) NULL,
	[DiscAmount] [float] NULL,
	[Subscription_period] [int] NOT NULL,
	[NextShipDate] [date] NULL,
	[DateAdded] [datetime] NULL,
	[Per_Item_Weight] [float] NOT NULL,
	[Pause] [bit] NOT NULL,
 CONSTRAINT [PK_Subscription_Order_Items] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Subscription_Settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Subscription_Settings](
	[ID] [int] NOT NULL,
	[FreeShipping] [bit] NOT NULL,
	[FlatRate] [float] NOT NULL,
	[ShippingType] [nvarchar](100) NULL,
	[ShippingMethod_id] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SystemText]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SystemText](
	[SystemText_ID] [int] IDENTITY(1,1) NOT NULL,
	[Text_Name] [nvarchar](100) NOT NULL,
	[CallAction] [nvarchar](100) NOT NULL,
	[System_Text] [ntext] NULL,
	[MergeCodes] [ntext] NULL,
	[Display] [bit] NOT NULL,
 CONSTRAINT [PK_SystemText] PRIMARY KEY CLUSTERED 
(
	[SystemText_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TaxCodes]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TaxCodes](
	[Code_ID] [int] IDENTITY(1,1) NOT NULL,
	[CodeName] [nvarchar](50) NOT NULL,
	[DisplayName] [nvarchar](50) NULL,
	[CalcOrder] [int] NULL,
	[Cumulative] [bit] NOT NULL,
	[TaxAddress] [nvarchar](25) NULL,
	[TaxAll] [bit] NOT NULL,
	[TaxRate] [float] NULL,
	[TaxShipping] [bit] NOT NULL,
	[ShowonProds] [bit] NOT NULL,
 CONSTRAINT [TaxCodes_PK] PRIMARY KEY CLUSTERED 
(
	[Code_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TempBasket]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TempBasket](
	[Basket_ID] [nvarchar](60) NOT NULL,
	[BasketNum] [nvarchar](30) NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Wishlist_ID] [int] NULL,
	[Options] [nvarchar](2000) NULL,
	[Addons] [nvarchar](2000) NULL,
	[AddonMultP] [float] NULL,
	[AddonNonMultP] [float] NULL,
	[AddonMultW] [float] NULL,
	[AddonNonMultW] [float] NULL,
	[OptPrice] [float] NOT NULL,
	[OptWeight] [float] NOT NULL,
	[sm_image] [nvarchar](250) NULL,
	[SKU] [nvarchar](100) NULL,
	[ALU] [nvarchar](100) NULL,
	[UPC] [nvarchar](100) NULL,
	[Price] [float] NULL,
	[Weight] [float] NULL,
	[Quantity] [int] NULL,
	[OptQuant] [int] NOT NULL,
	[OptChoice] [int] NULL,
	[OptionID_List] [nvarchar](255) NULL,
	[ChoiceID_List] [nvarchar](255) NULL,
	[GiftItem_ID] [int] NULL,
	[Discount] [int] NULL,
	[DiscAmount] [float] NULL,
	[Disc_Code] [nvarchar](50) NULL,
	[QuantDisc] [float] NULL,
	[Promotion] [int] NULL,
	[PromoAmount] [float] NULL,
	[PromoQuant] [int] NULL,
	[Promo_Code] [nvarchar](50) NULL,
	[Recalcquantity] [bit] NOT NULL,
	[InStockQuantity] [int] NULL,
	[Override] [bit] NULL,
	[Hide_in_Cart] [bit] NOT NULL,
	[Subscription] [bit] NOT NULL,
	[Subscription_discount] [float] NOT NULL,
	[Subscription_period] [int] NOT NULL,
	[PackageNum] [nvarchar](50) NULL,
	[PackageParent] [int] NOT NULL,
	[Category_id] [int] NOT NULL,
	[Shipping_Message] [nvarchar](500) NULL,
	[item_category] [nvarchar](100) NULL,
	[item_category2] [nvarchar](100) NULL,
	[item_category3] [nvarchar](100) NULL,
	[item_category4] [nvarchar](100) NULL,
	[item_category5] [nvarchar](100) NULL,
	[DateAdded] [datetime] NULL,
	[Gift] [bit] NOT NULL,
 CONSTRAINT [TempBasket_PK] PRIMARY KEY CLUSTERED 
(
	[Basket_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TempBasket_SFL]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TempBasket_SFL](
	[Basket_ID] [nvarchar](60) NOT NULL,
	[BasketNum] [nvarchar](30) NOT NULL,
	[Product_ID] [int] NOT NULL,
	[Wishlist_ID] [int] NULL,
	[Options] [nvarchar](2000) NULL,
	[Addons] [nvarchar](2000) NULL,
	[AddonMultP] [float] NULL,
	[AddonNonMultP] [float] NULL,
	[AddonMultW] [float] NULL,
	[AddonNonMultW] [float] NULL,
	[OptPrice] [float] NOT NULL,
	[OptWeight] [float] NOT NULL,
	[sm_image] [nvarchar](250) NULL,
	[SKU] [nvarchar](100) NULL,
	[ALU] [nvarchar](100) NULL,
	[UPC] [nvarchar](100) NULL,
	[Price] [float] NULL,
	[Weight] [float] NULL,
	[Quantity] [int] NULL,
	[OptQuant] [int] NOT NULL,
	[OptChoice] [int] NULL,
	[OptionID_List] [nvarchar](255) NULL,
	[ChoiceID_List] [nvarchar](255) NULL,
	[GiftItem_ID] [int] NULL,
	[Discount] [int] NULL,
	[DiscAmount] [float] NULL,
	[Disc_Code] [nvarchar](50) NULL,
	[QuantDisc] [float] NULL,
	[Promotion] [int] NULL,
	[PromoAmount] [float] NULL,
	[PromoQuant] [int] NULL,
	[Promo_Code] [nvarchar](50) NULL,
	[Recalcquantity] [tinyint] NOT NULL,
	[InStockQuantity] [int] NULL,
	[Override] [bit] NULL,
	[Subscription] [tinyint] NOT NULL,
	[Subscription_discount] [float] NOT NULL,
	[Subscription_period] [int] NOT NULL,
	[PackageNum] [nvarchar](50) NULL,
	[PackageParent] [int] NOT NULL,
	[Category_id] [int] NOT NULL,
	[DateAdded] [datetime] NULL,
 CONSTRAINT [TempBasket_SFL_PK] PRIMARY KEY CLUSTERED 
(
	[Basket_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TempCustomer]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TempCustomer](
	[TempCust_ID] [nvarchar](30) NOT NULL,
	[FirstName] [nvarchar](50) NULL,
	[LastName] [nvarchar](100) NULL,
	[Company] [nvarchar](150) NULL,
	[Address1] [nvarchar](150) NULL,
	[Address2] [nvarchar](150) NULL,
	[City] [nvarchar](150) NULL,
	[County] [nvarchar](50) NULL,
	[State] [nvarchar](50) NULL,
	[State2] [nvarchar](50) NULL,
	[Zip] [nvarchar](50) NULL,
	[Country] [nvarchar](50) NULL,
	[Phone] [nvarchar](150) NULL,
	[Email] [nvarchar](150) NULL,
	[ShipToYes] [bit] NULL,
	[DateAdded] [datetime] NULL,
	[Phone2] [nvarchar](150) NULL,
	[Fax] [nvarchar](50) NULL,
	[Residence] [bit] NULL,
	[Step] [nvarchar](75) NULL,
	[Abandoned] [bit] NULL,
	[Notes] [nvarchar](2000) NULL,
	[Contacted_by_Phone] [bit] NOT NULL,
	[Customer_shipping_account] [nvarchar](50) NULL,
	[Customer_shipper] [nvarchar](50) NULL,
	[TaxID] [nvarchar](50) NULL,
	[TaxFile] [nvarchar](1000) NULL,
	[BoatModel] [nvarchar](50) NULL,
	[BoatYear] [nvarchar](50) NULL,
	[SailNo] [nvarchar](50) NULL,
	[RigSprit] [nvarchar](50) NULL,
	[TradDine] [nvarchar](50) NULL,
	[Engine] [nvarchar](50) NULL,
	[Token1] [nvarchar](100) NULL,
	[Token2] [nvarchar](100) NULL,
	[Customer_ID] [int] NULL,
 CONSTRAINT [TempCustomer_PK] PRIMARY KEY CLUSTERED 
(
	[TempCust_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TempOrder]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TempOrder](
	[BasketNum] [nvarchar](30) NOT NULL,
	[OrderTotal] [float] NULL,
	[Tax] [float] NULL,
	[TaxID] [nvarchar](100) NULL,
	[TaxFile] [nvarchar](1000) NULL,
	[ShipType] [nvarchar](150) NULL,
	[Shipping] [float] NULL,
	[Freight] [int] NULL,
	[OrderDisc] [float] NULL,
	[Credits] [float] NULL,
	[AddonTotal] [float] NULL,
	[DateAdded] [datetime] NULL,
	[Affiliate] [int] NULL,
	[Referrer] [nvarchar](255) NULL,
	[GiftCard] [nvarchar](255) NULL,
	[Delivery] [nvarchar](50) NULL,
	[Comments] [nvarchar](255) NULL,
	[CustomText1] [nvarchar](255) NULL,
	[CustomText2] [nvarchar](255) NULL,
	[CustomText3] [nvarchar](255) NULL,
	[CustomSelect1] [nvarchar](100) NULL,
	[CustomSelect2] [nvarchar](100) NULL,
	[ShippingDisc] [float] NULL,
	[SettingID] [int] NOT NULL,
	[Subscribe_SMS_shipping] [tinyint] NOT NULL,
	[Subscribe_SMS_promo] [tinyint] NOT NULL,
	[Token1] [nvarchar](50) NULL,
	[Token2] [nvarchar](50) NULL,
	[Token_expiration] [datetime] NULL,
	[Avatax_Transaction_Code] [nvarchar](100) NULL,
	[customer_shipping_shipper] [nvarchar](50) NULL,
	[customer_shipping_account] [nvarchar](50) NULL,
	[customer_shipping_method] [nvarchar](50) NULL,
	[rate_id] [nvarchar](10) NULL,
	[allPackageInfoHTML] [text] NULL,
 CONSTRAINT [TempOrder_PK] PRIMARY KEY CLUSTERED 
(
	[BasketNum] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TempShipTo]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TempShipTo](
	[TempShip_ID] [nvarchar](30) NOT NULL,
	[FirstName] [nvarchar](50) NULL,
	[LastName] [nvarchar](150) NULL,
	[Company] [nvarchar](150) NULL,
	[Address1] [nvarchar](150) NULL,
	[Address2] [nvarchar](150) NULL,
	[City] [nvarchar](150) NULL,
	[County] [nvarchar](50) NULL,
	[State] [nvarchar](50) NULL,
	[State2] [nvarchar](50) NULL,
	[Zip] [nvarchar](50) NULL,
	[Country] [nvarchar](50) NULL,
	[DateAdded] [datetime] NULL,
	[Phone] [nvarchar](150) NULL,
	[Email] [nvarchar](150) NULL,
	[Residence] [bit] NULL,
 CONSTRAINT [TempShipTo_PK] PRIMARY KEY CLUSTERED 
(
	[TempShip_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[twilio_settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[twilio_settings](
	[twilio_id] [int] NOT NULL,
	[PhoneNumber] [nvarchar](150) NULL,
	[Account_SID] [nvarchar](100) NULL,
	[Auth_token] [nvarchar](100) NULL,
	[Subscribe_SMS_shipping] [tinyint] NOT NULL,
	[Subscribe_SMS_promo] [tinyint] NOT NULL,
	[Subscribe_SMS_confirmation] [tinyint] NOT NULL,
	[Confirmation_Message] [nvarchar](500) NULL,
	[NucomClientKey] [nvarchar](50) NULL,
	[NucomClientSecret] [nvarchar](100) NULL,
	[NucomAPIKey] [nvarchar](100) NULL,
	[CFWebstoreURL] [nvarchar](100) NULL,
	[NucomAccessToken] [nvarchar](500) NULL,
	[NucomServicesURL] [nvarchar](250) NULL,
 CONSTRAINT [PK_Twilio_Settings] PRIMARY KEY CLUSTERED 
(
	[twilio_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UPS_Origins]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UPS_Origins](
	[UPS_Code] [nvarchar](10) NOT NULL,
	[Description] [nvarchar](20) NULL,
	[OrderBy] [int] NULL,
 CONSTRAINT [UPS_Origins_PK] PRIMARY KEY CLUSTERED 
(
	[UPS_Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UPS_Packaging]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UPS_Packaging](
	[UPS_Code] [nvarchar](10) NOT NULL,
	[Description] [nvarchar](50) NULL,
 CONSTRAINT [UPS_Packaging_PK] PRIMARY KEY CLUSTERED 
(
	[UPS_Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UPS_Pickup]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UPS_Pickup](
	[UPS_Code] [nvarchar](10) NOT NULL,
	[Description] [nvarchar](50) NULL,
 CONSTRAINT [UPS_Pickup_PK] PRIMARY KEY CLUSTERED 
(
	[UPS_Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UPS_Settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UPS_Settings](
	[UPS_ID] [int] IDENTITY(1,1) NOT NULL,
	[ResRates] [bit] NOT NULL,
	[Username] [nvarchar](150) NULL,
	[Password] [nvarchar](150) NULL,
	[Accesskey] [nvarchar](100) NULL,
	[AccountNo] [nvarchar](20) NULL,
	[Origin] [nvarchar](10) NULL,
	[MaxWeight] [int] NOT NULL,
	[UnitsofMeasure] [nvarchar](20) NULL,
	[CustomerClass] [nvarchar](20) NULL,
	[Pickup] [nvarchar](20) NULL,
	[Packaging] [nvarchar](20) NULL,
	[OrigZip] [nvarchar](20) NULL,
	[OrigCity] [nvarchar](75) NULL,
	[OrigState] [nvarchar](10) NULL,
	[OrigCountry] [nvarchar](10) NULL,
	[Debug] [bit] NOT NULL,
	[UseAV] [bit] NOT NULL,
	[Logging] [bit] NOT NULL,
	[ShowNegotiatedRates] [bit] NOT NULL,
 CONSTRAINT [UPS_Settings_PK] PRIMARY KEY CLUSTERED 
(
	[UPS_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UPSMethods]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UPSMethods](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](75) NULL,
	[USCode] [nvarchar](5) NULL,
	[EUCode] [nvarchar](5) NULL,
	[CACode] [nvarchar](5) NULL,
	[PRCode] [nvarchar](5) NULL,
	[MXCode] [nvarchar](5) NULL,
	[OOCode] [nvarchar](5) NULL,
	[Used] [bit] NOT NULL,
	[Priority] [int] NULL,
	[MethodHand] [float] NOT NULL,
	[MethodWeight] [float] NOT NULL,
 CONSTRAINT [UPSMethods_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[User_ID] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](150) NOT NULL,
	[Email] [nvarchar](150) NULL,
	[EmailIsBad] [bit] NOT NULL,
	[EmailLock] [nvarchar](50) NULL,
	[Subscribe] [bit] NOT NULL,
	[Subscribe_SMS_shipping] [tinyint] NOT NULL,
	[Subscribe_SMS_promo] [tinyint] NOT NULL,
	[Customer_ID] [int] NOT NULL,
	[ShipTo] [int] NOT NULL,
	[Group_ID] [int] NOT NULL,
	[Group_list] [nvarchar](500) NULL,
	[Account_ID] [int] NULL,
	[SettingID] [int] NULL,
	[Affiliate_ID] [int] NULL,
	[Basket] [nvarchar](30) NULL,
	[Birthdate] [datetime] NULL,
	[CardisValid] [bit] NOT NULL,
	[CardType] [nvarchar](50) NULL,
	[NameonCard] [nvarchar](75) NULL,
	[CardNumber] [nvarchar](50) NULL,
	[CardExpire] [datetime] NULL,
	[CardZip] [nvarchar](50) NULL,
	[EncryptedCard] [nvarchar](75) NULL,
	[CurrentBalance] [int] NULL,
	[LastLogin] [datetime] NULL,
	[Permissions] [nvarchar](255) NULL,
	[AdminNotes] [ntext] NULL,
	[Disable] [bit] NOT NULL,
	[Token1] [nvarchar](50) NULL,
	[Token2] [nvarchar](50) NULL,
	[Token_expiration] [datetime] NULL,
	[TaxExempt] [bit] NOT NULL,
	[TaxID] [nvarchar](255) NULL,
	[TaxFile] [nvarchar](2000) NULL,
	[Allow_PO] [bit] NOT NULL,
	[LoginsTotal] [int] NULL,
	[LoginsDay] [int] NULL,
	[FailedLogins] [int] NULL,
	[LastAttempt] [datetime] NULL,
	[Created] [datetime] NULL,
	[LastUpdate] [datetime] NULL,
	[OneTimeCode] [nvarchar](20) NULL,
	[OneTimeCodeDate] [datetime] NULL,
	[ID_Tag] [nvarchar](35) NULL,
	[Boat_ID] [int] NULL,
 CONSTRAINT [Users_PK] PRIMARY KEY CLUSTERED 
(
	[User_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserSettings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserSettings](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[UseRememberMe] [bit] NOT NULL,
	[EmailAsName] [bit] NOT NULL,
	[UseStateList] [bit] NOT NULL,
	[UseStateBox] [bit] NOT NULL,
	[RequireCounty] [bit] NOT NULL,
	[UseCountryList] [bit] NOT NULL,
	[UseResidential] [bit] NOT NULL,
	[UseTaxID] [bit] NOT NULL,
	[UseCustomerShipping] [bit] NOT NULL,
	[UseGroupCode] [bit] NOT NULL,
	[UseBirthdate] [bit] NOT NULL,
	[UseTerms] [bit] NOT NULL,
	[TermsText] [ntext] NULL,
	[UseCCard] [bit] NOT NULL,
	[UseEmailConf] [bit] NOT NULL,
	[UseEmailNotif] [bit] NOT NULL,
	[MemberNotify] [bit] NOT NULL,
	[UseShipTo] [bit] NOT NULL,
	[UseAccounts] [bit] NOT NULL,
	[ShowAccount] [bit] NOT NULL,
	[ShowDirectory] [bit] NOT NULL,
	[ShowSubscribe] [bit] NOT NULL,
	[SubscribeCustomer] [bit] NOT NULL,
	[StrictLogins] [bit] NOT NULL,
	[MaxDailyLogins] [int] NOT NULL,
	[MaxFailures] [int] NOT NULL,
	[AllowAffs] [bit] NOT NULL,
	[AffPercent] [float] NULL,
	[AllowWholesale] [bit] NOT NULL,
 CONSTRAINT [UserSettings_PK] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USPS_Settings]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USPS_Settings](
	[USPS_ID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [nvarchar](30) NOT NULL,
	[Server] [nvarchar](75) NOT NULL,
	[MerchantZip] [nvarchar](20) NULL,
	[MaxWeight] [int] NOT NULL,
	[Logging] [bit] NOT NULL,
	[Debug] [bit] NOT NULL,
	[UseAV] [bit] NOT NULL,
 CONSTRAINT [USPS_Settings_PK] PRIMARY KEY CLUSTERED 
(
	[USPS_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USPSCountries]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USPSCountries](
	[ID] [int] NOT NULL,
	[Abbrev] [nvarchar](2) NOT NULL,
	[Name] [nvarchar](255) NOT NULL,
 CONSTRAINT [USPSCountries_PK] PRIMARY KEY NONCLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USPSMethods]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USPSMethods](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](75) NULL,
	[Used] [bit] NOT NULL,
	[Code] [nvarchar](225) NULL,
	[Type] [nvarchar](20) NULL,
	[MethodHand] [float] NOT NULL,
	[MethodWeight] [float] NOT NULL,
	[Priority] [int] NULL,
 CONSTRAINT [USPSMethods_PK] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WishList]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WishList](
	[Wishlist_ID] [int] IDENTITY(1,1) NOT NULL,
	[User_ID] [int] NOT NULL,
	[ListNum] [int] NOT NULL,
	[ItemNum] [int] NOT NULL,
	[ListName] [nvarchar](50) NULL,
	[Product_ID] [int] NOT NULL,
	[DateAdded] [datetime] NULL,
	[NumDesired] [int] NULL,
	[Comments] [nvarchar](255) NULL,
	[options] [nvarchar](500) NULL,
	[addons] [nvarchar](500) NULL,
	[AddonMultP] [float] NOT NULL,
	[AddonNonMultP] [float] NOT NULL,
	[AddonMultW] [float] NOT NULL,
	[AddonNonMultW] [float] NOT NULL,
	[OptPrice] [float] NOT NULL,
	[OptWeight] [float] NOT NULL,
	[OptQuant] [int] NOT NULL,
	[OptChoice] [smallint] NOT NULL,
	[OptionID_List] [varchar](255) NULL,
	[ChoiceID_List] [varchar](255) NULL,
	[SKU] [varchar](255) NULL,
	[ALU] [varchar](255) NULL,
	[UPC] [varchar](255) NULL,
	[Price] [float] NOT NULL,
	[Weight] [float] NOT NULL,
	[Quantity_Requested] [smallint] NOT NULL,
	[Quantity_Purchased] [smallint] NOT NULL,
	[sm_image] [nvarchar](250) NULL,
 CONSTRAINT [WishList_PK] PRIMARY KEY NONCLUSTERED 
(
	[Wishlist_ID] ASC,
	[User_ID] ASC,
	[ListNum] ASC,
	[ItemNum] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ZIPCodes]    Script Date: 3/21/2026 5:56:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ZIPCodes](
	[ZipCode] [char](5) NOT NULL,
	[City] [varchar](35) NULL,
	[State] [char](2) NULL,
	[County] [varchar](45) NULL,
	[AreaCode] [varchar](55) NULL,
	[CityType] [char](1) NULL,
	[CityAliasAbbreviation] [varchar](13) NULL,
	[CityAliasName] [varchar](35) NULL,
	[Latitude] [decimal](12, 6) NULL,
	[Longitude] [decimal](12, 6) NULL,
	[TimeZone] [char](2) NULL,
	[Elevation] [int] NULL,
	[CountyFIPS] [char](5) NULL,
	[DayLightSaving] [char](1) NULL,
	[PreferredLastLineKey] [varchar](10) NULL,
	[ClassificationCode] [char](1) NULL,
	[MultiCounty] [char](1) NULL,
	[StateFIPS] [char](2) NULL,
	[CityStateKey] [char](6) NULL,
	[CityAliasCode] [varchar](5) NULL,
	[PrimaryRecord] [char](1) NULL,
	[CityMixedCase] [varchar](35) NULL,
	[CityAliasMixedCase] [varchar](35) NULL,
	[StateANSI] [varchar](2) NULL,
	[CountyANSI] [varchar](3) NULL,
	[FacilityCode] [varchar](1) NULL,
	[CityDeliveryIndicator] [varchar](1) NULL,
	[CarrierRouteRateSortation] [varchar](1) NULL,
	[FinanceNumber] [varchar](6) NULL,
	[UniqueZIPName] [varchar](1) NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AccessKeys] ADD  DEFAULT ((0)) FOR [System]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT ((0)) FOR [Customer_ID]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT ((0)) FOR [Directory_Live]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT ((0)) FOR [Hold_MAP]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT ((0)) FOR [Sold_by_Amazon]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT ((0)) FOR [Sold_by_Manufactorer_on_Amazon]
GO
ALTER TABLE [dbo].[Account] ADD  DEFAULT ((0)) FOR [LTSPManfID]
GO
ALTER TABLE [dbo].[Affiliates] ADD  DEFAULT ((0)) FOR [AffCode]
GO
ALTER TABLE [dbo].[Affiliates] ADD  DEFAULT ((0)) FOR [AffPercent]
GO
ALTER TABLE [dbo].[Amazon_Schedule] ADD  DEFAULT ('24') FOR [Time_Interval]
GO
ALTER TABLE [dbo].[Amazon_Settings] ADD  DEFAULT ('https://www.nucomwebhosting.com') FOR [NucomServicesURL]
GO
ALTER TABLE [dbo].[Avatax_Settings] ADD  CONSTRAINT [DF_Avatax_Settings_ID]  DEFAULT ((1)) FOR [ID]
GO
ALTER TABLE [dbo].[Avatax_Settings] ADD  CONSTRAINT [DF__Avatax_Se__TaxSh__286DEFE4]  DEFAULT ((1)) FOR [TaxShipping]
GO
ALTER TABLE [dbo].[Avatax_Settings] ADD  CONSTRAINT [DF__Avatax_Se__TaxAd__2962141D]  DEFAULT ('Shipping') FOR [TaxAddress]
GO
ALTER TABLE [dbo].[Avatax_Settings] ADD  CONSTRAINT [DF__Avatax_Se__Nucom__2A563856]  DEFAULT ('https://www.nucomwebhosting.com') FOR [NucomServicesURL]
GO
ALTER TABLE [dbo].[Blog] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[Blog] ADD  DEFAULT ((0)) FOR [Category_id]
GO
ALTER TABLE [dbo].[Blog] ADD  DEFAULT ((0)) FOR [Display]
GO
ALTER TABLE [dbo].[Blog] ADD  DEFAULT ((0)) FOR [Approved]
GO
ALTER TABLE [dbo].[Blog] ADD  DEFAULT ((9999)) FOR [Priority]
GO
ALTER TABLE [dbo].[Blog] ADD  DEFAULT ((0)) FOR [AccessKey]
GO
ALTER TABLE [dbo].[Blog] ADD  DEFAULT ((0)) FOR [Highlight]
GO
ALTER TABLE [dbo].[Blog] ADD  DEFAULT ((0)) FOR [Display_Title]
GO
ALTER TABLE [dbo].[Blog] ADD  DEFAULT ((0)) FOR [Reviewable]
GO
ALTER TABLE [dbo].[Blog] ADD  DEFAULT ((0)) FOR [Views]
GO
ALTER TABLE [dbo].[Blog_Category] ADD  DEFAULT ((1)) FOR [display]
GO
ALTER TABLE [dbo].[Blog_Category] ADD  DEFAULT ((9999)) FOR [priority]
GO
ALTER TABLE [dbo].[Blog_settings] ADD  DEFAULT ((1)) FOR [ID]
GO
ALTER TABLE [dbo].[Blog_settings] ADD  DEFAULT ((6)) FOR [maxBlogs]
GO
ALTER TABLE [dbo].[Blog_settings] ADD  DEFAULT ((3)) FOR [blog_columns]
GO
ALTER TABLE [dbo].[Blog_settings] ADD  DEFAULT ((1)) FOR [show_cloud]
GO
ALTER TABLE [dbo].[Blog_settings] ADD  DEFAULT ((1)) FOR [show_categories]
GO
ALTER TABLE [dbo].[Blog_settings] ADD  DEFAULT ((1)) FOR [show_recentPosts]
GO
ALTER TABLE [dbo].[Blog_settings] ADD  DEFAULT ((1)) FOR [show_search]
GO
ALTER TABLE [dbo].[Blog_settings] ADD  DEFAULT ((1)) FOR [color_id]
GO
ALTER TABLE [dbo].[Blog_settings] ADD  DEFAULT ((1)) FOR [BlogReviews]
GO
ALTER TABLE [dbo].[Blog_settings] ADD  DEFAULT ((0)) FOR [BlogReview_flag]
GO
ALTER TABLE [dbo].[Blog_settings] ADD  DEFAULT ((0)) FOR [BlogReview_Approve]
GO
ALTER TABLE [dbo].[Blog_settings] ADD  DEFAULT ((0)) FOR [Captcha]
GO
ALTER TABLE [dbo].[BlogReviews] ADD  DEFAULT ((0)) FOR [Parent_ID]
GO
ALTER TABLE [dbo].[BlogReviews] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[BlogReviews] ADD  DEFAULT ((0)) FOR [Anonymous]
GO
ALTER TABLE [dbo].[BlogReviews] ADD  DEFAULT ((0)) FOR [Recommend]
GO
ALTER TABLE [dbo].[BlogReviews] ADD  DEFAULT ((0)) FOR [Approved]
GO
ALTER TABLE [dbo].[BlogReviews] ADD  DEFAULT ((0)) FOR [NeedsCheck]
GO
ALTER TABLE [dbo].[CardData] ADD  DEFAULT ((0)) FOR [Customer_ID]
GO
ALTER TABLE [dbo].[CatCore] ADD  DEFAULT ((0)) FOR [CatCore_ID]
GO
ALTER TABLE [dbo].[CatCore] ADD  DEFAULT ((0)) FOR [Category]
GO
ALTER TABLE [dbo].[CatCore] ADD  DEFAULT ((0)) FOR [Products]
GO
ALTER TABLE [dbo].[CatCore] ADD  DEFAULT ((0)) FOR [Features]
GO
ALTER TABLE [dbo].[CatCore] ADD  DEFAULT ((0)) FOR [Page]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Paren__43A1090D]  DEFAULT ((0)) FOR [Parent_ID]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__CatCo__44952D46]  DEFAULT ((9)) FOR [CatCore_ID]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Lg_im__4589517F]  DEFAULT ((0)) FOR [Lg_image_position]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__MM_ta__467D75B8]  DEFAULT ((0)) FOR [MM_tab]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__MM_wi__477199F1]  DEFAULT ('dropdown_flyout') FOR [MM_width]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__MM_fl__4865BE2A]  DEFAULT ('dropdown_2columns') FOR [MM_flyout_width]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__MM_co__4959E263]  DEFAULT ((1)) FOR [MM_columns]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__MM_su__4A4E069C]  DEFAULT ((1)) FOR [MM_subcats]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__MM_pr__4B422AD5]  DEFAULT ((0)) FOR [MM_productID]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__MM_sh__4C364F0E]  DEFAULT ((0)) FOR [MM_show_sm_image]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Produ__4D2A7347]  DEFAULT ((0)) FOR [Product_show_shortDesc]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Produ__4E1E9780]  DEFAULT ((0)) FOR [Product_show_orderBox]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Produ__4F12BBB9]  DEFAULT ((0)) FOR [Product_show_Ratings]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Produ__5006DFF2]  DEFAULT ((0)) FOR [Product_show_Icons]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Produ__50FB042B]  DEFAULT ((0)) FOR [Product_show_details]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Produ__51EF2864]  DEFAULT ((0)) FOR [Product_show_SKU]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Produ__52E34C9D]  DEFAULT ((0)) FOR [Product_show_customFields]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Categ__53D770D6]  DEFAULT ((0)) FOR [Category_image_height]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__All_p__54CB950F]  DEFAULT ((0)) FOR [All_products]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Rando__55BFB948]  DEFAULT ((0)) FOR [Random]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__ShowC__56B3DD81]  DEFAULT ((1)) FOR [ShowCatHeader]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__ShowP__57A801BA]  DEFAULT ((0)) FOR [ShowProdLeftColumn]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__ShowB__589C25F3]  DEFAULT ((1)) FOR [ShowBrands]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__ShowS__59904A2C]  DEFAULT ((1)) FOR [ShowSubCats]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF_Categories_ShowSubCats_mobile]  DEFAULT ((1)) FOR [ShowSubCats_mobile]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__ShowP__5A846E65]  DEFAULT ((1)) FOR [ShowProdFilter]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__ShowP__5B78929E]  DEFAULT ((1)) FOR [ShowProdType]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__ShowP__5C6CB6D7]  DEFAULT ((0)) FOR [ShowPriceSlider]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Acces__5D60DB10]  DEFAULT ((0)) FOR [AccessKey]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Displ__5E54FF49]  DEFAULT ((1)) FOR [Display]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Displ__5F492382]  DEFAULT ((1)) FOR [Display_Menu]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Displ__603D47BB]  DEFAULT ((1)) FOR [Display_Mobile]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__ProdF__61316BF4]  DEFAULT ((0)) FOR [ProdFirst]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Text___6225902D]  DEFAULT ((0)) FOR [Text_position]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Galle__6319B466]  DEFAULT ((0)) FOR [Gallery_position]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Prior__640DD89F]  DEFAULT ((9999)) FOR [Priority]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__Highl__6501FCD8]  DEFAULT ((0)) FOR [Highlight]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categories__Sale__65F62111]  DEFAULT ((0)) FOR [Sale]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF__Categorie__LTSPC__66EA454A]  DEFAULT ((0)) FOR [LTSPCatID]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF_Categories_Lg_image_hide]  DEFAULT ((0)) FOR [Lg_image_hide]
GO
ALTER TABLE [dbo].[Categories] ADD  CONSTRAINT [DF_Categories_Priority2]  DEFAULT ((9999)) FOR [Priority2]
GO
ALTER TABLE [dbo].[CCProcess] ADD  DEFAULT ((1)) FOR [Use_token]
GO
ALTER TABLE [dbo].[CCProcess] ADD  DEFAULT ('https://www.nucomwebhosting.com') FOR [NucomServicesURL]
GO
ALTER TABLE [dbo].[Certificates] ADD  DEFAULT ((0)) FOR [CertAmount]
GO
ALTER TABLE [dbo].[Certificates] ADD  DEFAULT ((0)) FOR [InitialAmount]
GO
ALTER TABLE [dbo].[Certificates] ADD  DEFAULT (getdate()) FOR [DateCreated]
GO
ALTER TABLE [dbo].[Certificates] ADD  DEFAULT ((0)) FOR [Valid]
GO
ALTER TABLE [dbo].[Certificates] ADD  DEFAULT ((0)) FOR [Order_No]
GO
ALTER TABLE [dbo].[Certificates] ADD  DEFAULT ((1)) FOR [Setting_ID]
GO
ALTER TABLE [dbo].[Certificates] ADD  DEFAULT ('Certificate') FOR [Type]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__Boxed__6CD828CA]  DEFAULT ((0)) FOR [Boxed]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__TopBar_D__6DCC4D03]  DEFAULT ((1)) FOR [TopBar_Display]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF_Colors_TopBar_Scroller]  DEFAULT ((0)) FOR [TopBar_Scroller]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF_Colors_TopBar_Scroller_Speed]  DEFAULT ((65)) FOR [TopBar_Scroller_Speed]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__Header_s__6EC0713C]  DEFAULT ((0)) FOR [Header_style]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__header_t__6FB49575]  DEFAULT ((0)) FOR [header_text_color]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__Header_m__70A8B9AE]  DEFAULT ((0)) FOR [Header_mobile_style]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__Header_i__719CDDE7]  DEFAULT ((0)) FOR [Header_icon_style]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__Header_i__72910220]  DEFAULT ((0)) FOR [Header_icon_phone]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__Header_i__73852659]  DEFAULT ((0)) FOR [Header_icon_email]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__Header_i__74794A92]  DEFAULT ((0)) FOR [Header_icon_marker]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__Header_i__756D6ECB]  DEFAULT ((0)) FOR [Header_icon_cart]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__Header_i__76619304]  DEFAULT ((0)) FOR [Header_icon_search]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__Header_i__7755B73D]  DEFAULT ((0)) FOR [Header_icon_navigation]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__Header_i__7849DB76]  DEFAULT ((0)) FOR [Header_icon_user]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF_Colors_Header_icon_wishlist]  DEFAULT ((0)) FOR [Header_icon_wishlist]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF_Colors_Header_icon_gift]  DEFAULT ((0)) FOR [Header_icon_gift]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__MenuStyl__793DFFAF]  DEFAULT ((1)) FOR [MenuStyle]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__MM_show___7A3223E8]  DEFAULT ((3)) FOR [MM_show_home]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__MM_upper__7B264821]  DEFAULT ((0)) FOR [MM_uppercase]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__MM_level__7C1A6C5A]  DEFAULT ((99)) FOR [MM_levels]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__MM_menu___7D0E9093]  DEFAULT ((0)) FOR [MM_menu_alignment]
GO
ALTER TABLE [dbo].[Colors] ADD  CONSTRAINT [DF__Colors__MM_Show___7E02B4CC]  DEFAULT ((0)) FOR [MM_Show_Caret]
GO
ALTER TABLE [dbo].[ConstantContact_settings] ADD  DEFAULT ((1)) FOR [ID]
GO
ALTER TABLE [dbo].[ConstantContact_settings] ADD  DEFAULT ((0)) FOR [scheduled]
GO
ALTER TABLE [dbo].[ConstantContact_settings] ADD  DEFAULT ((0)) FOR [Subscribe_guests]
GO
ALTER TABLE [dbo].[ContactForms] ADD  DEFAULT ((1)) FOR [SettingID]
GO
ALTER TABLE [dbo].[ContactForms] ADD  DEFAULT ('Created') FOR [Status]
GO
ALTER TABLE [dbo].[ContactForms] ADD  DEFAULT ((0)) FOR [ReadStatus]
GO
ALTER TABLE [dbo].[ContactForms] ADD  DEFAULT (getdate()) FOR [DateCreated]
GO
ALTER TABLE [dbo].[ContactForms] ADD  DEFAULT (getdate()) FOR [DateLastUpdated]
GO
ALTER TABLE [dbo].[Counties] ADD  DEFAULT ((0)) FOR [Code_ID]
GO
ALTER TABLE [dbo].[Counties] ADD  DEFAULT ((0)) FOR [TaxRate]
GO
ALTER TABLE [dbo].[Counties] ADD  DEFAULT ((0)) FOR [TaxShip]
GO
ALTER TABLE [dbo].[Countries] ADD  DEFAULT ((0)) FOR [AllowUPS]
GO
ALTER TABLE [dbo].[Countries] ADD  DEFAULT ((0)) FOR [Shipping]
GO
ALTER TABLE [dbo].[Countries] ADD  DEFAULT ((0)) FOR [AddShipAmount]
GO
ALTER TABLE [dbo].[Countries] ADD  DEFAULT ((1)) FOR [Display]
GO
ALTER TABLE [dbo].[CountryTax] ADD  DEFAULT ((0)) FOR [Code_ID]
GO
ALTER TABLE [dbo].[CountryTax] ADD  DEFAULT ((0)) FOR [Country_ID]
GO
ALTER TABLE [dbo].[CountryTax] ADD  DEFAULT ((0)) FOR [TaxRate]
GO
ALTER TABLE [dbo].[CountryTax] ADD  DEFAULT ((0)) FOR [TaxShip]
GO
ALTER TABLE [dbo].[CreditCards] ADD  DEFAULT ((0)) FOR [Used]
GO
ALTER TABLE [dbo].[Currency] ADD  DEFAULT ((1)) FOR [Used]
GO
ALTER TABLE [dbo].[Customers] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[Customers] ADD  DEFAULT ((1)) FOR [Residence]
GO
ALTER TABLE [dbo].[Customers] ADD  DEFAULT (getdate()) FOR [created]
GO
ALTER TABLE [dbo].[CustomMethods] ADD  CONSTRAINT [DF__CustomMet__Amoun__282DF8C2]  DEFAULT ((0)) FOR [Amount]
GO
ALTER TABLE [dbo].[CustomMethods] ADD  CONSTRAINT [DF__CustomMeth__Used__29221CFB]  DEFAULT ((0)) FOR [Used]
GO
ALTER TABLE [dbo].[CustomMethods] ADD  CONSTRAINT [DF__CustomMet__Prior__2A164134]  DEFAULT ((0)) FOR [Priority]
GO
ALTER TABLE [dbo].[CustomMethods] ADD  CONSTRAINT [DF__CustomMet__Domes__2B0A656D]  DEFAULT ((0)) FOR [Domestic]
GO
ALTER TABLE [dbo].[CustomMethods] ADD  CONSTRAINT [DF__CustomMet__Inter__2BFE89A6]  DEFAULT ((0)) FOR [International]
GO
ALTER TABLE [dbo].[CustomMethods] ADD  CONSTRAINT [DF__CustomMet__Metho__2CF2ADDF]  DEFAULT ((0)) FOR [MethodHand]
GO
ALTER TABLE [dbo].[CustomMethods] ADD  CONSTRAINT [DF__CustomMet__Metho__2DE6D218]  DEFAULT ((0)) FOR [MethodWeight]
GO
ALTER TABLE [dbo].[CustomShipSettings] ADD  DEFAULT ((0)) FOR [ShowShipTable]
GO
ALTER TABLE [dbo].[CustomShipSettings] ADD  DEFAULT ((0)) FOR [MultPerItem]
GO
ALTER TABLE [dbo].[CustomShipSettings] ADD  DEFAULT ((0)) FOR [CumulativeAmounts]
GO
ALTER TABLE [dbo].[CustomShipSettings] ADD  DEFAULT ((0)) FOR [MultMethods]
GO
ALTER TABLE [dbo].[CustomShipSettings] ADD  DEFAULT ((0)) FOR [Debug]
GO
ALTER TABLE [dbo].[Dealer] ADD  DEFAULT ((0)) FOR [Account_id]
GO
ALTER TABLE [dbo].[Dealer] ADD  DEFAULT ((0)) FOR [User_id]
GO
ALTER TABLE [dbo].[Dealer] ADD  DEFAULT ((0)) FOR [Customer_id]
GO
ALTER TABLE [dbo].[Dealer] ADD  DEFAULT ((9999)) FOR [priority]
GO
ALTER TABLE [dbo].[Dealer] ADD  DEFAULT ((0)) FOR [category_id]
GO
ALTER TABLE [dbo].[Dealer] ADD  DEFAULT ((1)) FOR [display]
GO
ALTER TABLE [dbo].[Dealer_Categories] ADD  DEFAULT ((9999)) FOR [priority]
GO
ALTER TABLE [dbo].[Dealer_Settings] ADD  DEFAULT ((0)) FOR [map_style]
GO
ALTER TABLE [dbo].[Dealer_Settings] ADD  DEFAULT ((0)) FOR [show_category]
GO
ALTER TABLE [dbo].[Dealer_Settings] ADD  DEFAULT ((1)) FOR [show_google]
GO
ALTER TABLE [dbo].[Dealer_Settings] ADD  DEFAULT ((1)) FOR [show_allpoints]
GO
ALTER TABLE [dbo].[Dealer_Settings] ADD  DEFAULT ((0)) FOR [show_country_search]
GO
ALTER TABLE [dbo].[Discounts] ADD  DEFAULT ((1)) FOR [Type1]
GO
ALTER TABLE [dbo].[Discounts] ADD  DEFAULT ((1)) FOR [Type2]
GO
ALTER TABLE [dbo].[Discounts] ADD  DEFAULT ((0)) FOR [Type3]
GO
ALTER TABLE [dbo].[Discounts] ADD  DEFAULT ((0)) FOR [Type4]
GO
ALTER TABLE [dbo].[Discounts] ADD  DEFAULT ((0)) FOR [Type5]
GO
ALTER TABLE [dbo].[Discounts] ADD  DEFAULT ((0)) FOR [OneTime]
GO
ALTER TABLE [dbo].[Discounts] ADD  DEFAULT ((0)) FOR [Amount]
GO
ALTER TABLE [dbo].[Discounts] ADD  DEFAULT ((0)) FOR [MinOrder]
GO
ALTER TABLE [dbo].[Discounts] ADD  DEFAULT ((0)) FOR [MaxOrder]
GO
ALTER TABLE [dbo].[Discounts] ADD  DEFAULT ((0)) FOR [AccessKey]
GO
ALTER TABLE [dbo].[Discounts] ADD  DEFAULT ((0)) FOR [Discountonsubsite]
GO
ALTER TABLE [dbo].[Easypost] ADD  DEFAULT ((0)) FOR [useshipbox]
GO
ALTER TABLE [dbo].[Easypost] ADD  DEFAULT ((0)) FOR [UseAV]
GO
ALTER TABLE [dbo].[Easypost] ADD  DEFAULT ((0)) FOR [debug]
GO
ALTER TABLE [dbo].[Easypost] ADD  DEFAULT ((1)) FOR [Show_delivery_date]
GO
ALTER TABLE [dbo].[Easypost] ADD  DEFAULT ((0)) FOR [default_prep_days]
GO
ALTER TABLE [dbo].[Easypost] ADD  DEFAULT ((0)) FOR [ShowShipFrom]
GO
ALTER TABLE [dbo].[Easypost] ADD  DEFAULT (NULL) FOR [Friendly_Name]
GO
ALTER TABLE [dbo].[Easypost] ADD  DEFAULT ((1)) FOR [Email_customer]
GO
ALTER TABLE [dbo].[Easypost] ADD  DEFAULT ((1)) FOR [SMS_customer]
GO
ALTER TABLE [dbo].[Easypost] ADD  DEFAULT ((2)) FOR [Rate_to_show]
GO
ALTER TABLE [dbo].[Easypost] ADD  DEFAULT ('https://www.nucomwebhosting.com') FOR [NucomServicesURL]
GO
ALTER TABLE [dbo].[Easypost_box_size] ADD  DEFAULT ((0)) FOR [height]
GO
ALTER TABLE [dbo].[Easypost_box_size] ADD  DEFAULT ((0)) FOR [width]
GO
ALTER TABLE [dbo].[Easypost_box_size] ADD  DEFAULT ((0)) FOR [length]
GO
ALTER TABLE [dbo].[Easypost_box_size] ADD  DEFAULT ((0)) FOR [packaging]
GO
ALTER TABLE [dbo].[Easypost_box_size] ADD  DEFAULT ((0)) FOR [weight]
GO
ALTER TABLE [dbo].[Easypost_Label] ADD  DEFAULT ((0)) FOR [Customer_id]
GO
ALTER TABLE [dbo].[Easypost_Label] ADD  DEFAULT ((0)) FOR [Actual_Shipping]
GO
ALTER TABLE [dbo].[EasypostMethods] ADD  DEFAULT ((0)) FOR [MethodHand]
GO
ALTER TABLE [dbo].[EasypostMethods] ADD  DEFAULT ((0)) FOR [MethodWeight]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [Engraveable]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [Engraving_Lines_Team]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [Engraving_Lines_Promotional]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [Engraving_Lines_Imprinting]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [Engraving_Lines_Custom]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [Engraving_Lines_Engraving]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [Per_Letter_Engraving_Cost]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [LogoEngravingSetup]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [LogoEngraving]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [Free_Engraving]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [Proof_Available]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [Prep_Days]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((4)) FOR [Blocks_Per_Page]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [Text_Line_Length]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((4)) FOR [Colors_Per_Prod]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [ColorSetupCharge_1]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [ColorSetupCharge_2]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [ColorSetupCharge_3]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [ColorSetupCharge_4]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [ColorSetupCharge_5]
GO
ALTER TABLE [dbo].[Engraving_Settings] ADD  DEFAULT ((0)) FOR [ColorRunCharge_BAK]
GO
ALTER TABLE [dbo].[FeatureReviews] ADD  DEFAULT ((0)) FOR [Parent_ID]
GO
ALTER TABLE [dbo].[FeatureReviews] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[FeatureReviews] ADD  DEFAULT ((0)) FOR [Anonymous]
GO
ALTER TABLE [dbo].[FeatureReviews] ADD  DEFAULT ((0)) FOR [Rating]
GO
ALTER TABLE [dbo].[FeatureReviews] ADD  DEFAULT ((0)) FOR [Recommend]
GO
ALTER TABLE [dbo].[FeatureReviews] ADD  DEFAULT ((0)) FOR [Approved]
GO
ALTER TABLE [dbo].[FeatureReviews] ADD  DEFAULT ((0)) FOR [NeedsCheck]
GO
ALTER TABLE [dbo].[Features] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[Features] ADD  DEFAULT ((0)) FOR [Display]
GO
ALTER TABLE [dbo].[Features] ADD  DEFAULT ((0)) FOR [Approved]
GO
ALTER TABLE [dbo].[Features] ADD  DEFAULT ((9999)) FOR [Priority]
GO
ALTER TABLE [dbo].[Features] ADD  DEFAULT ((0)) FOR [AccessKey]
GO
ALTER TABLE [dbo].[Features] ADD  DEFAULT ((0)) FOR [Highlight]
GO
ALTER TABLE [dbo].[Features] ADD  DEFAULT ((0)) FOR [Display_Title]
GO
ALTER TABLE [dbo].[Features] ADD  DEFAULT ((0)) FOR [Reviewable]
GO
ALTER TABLE [dbo].[FedEx_Settings] ADD  DEFAULT ((0)) FOR [MaxWeight]
GO
ALTER TABLE [dbo].[FedEx_Settings] ADD  DEFAULT ((0)) FOR [Debug]
GO
ALTER TABLE [dbo].[FedEx_Settings] ADD  DEFAULT ((0)) FOR [UseGround]
GO
ALTER TABLE [dbo].[FedEx_Settings] ADD  DEFAULT ((0)) FOR [UseExpress]
GO
ALTER TABLE [dbo].[FedEx_Settings] ADD  DEFAULT ((0)) FOR [Logging]
GO
ALTER TABLE [dbo].[FedEx_Settings] ADD  DEFAULT ((0)) FOR [UseSmartPost]
GO
ALTER TABLE [dbo].[FedEx_Settings] ADD  DEFAULT ((0)) FOR [AddInsurance]
GO
ALTER TABLE [dbo].[FedExMethods] ADD  DEFAULT ((0)) FOR [Used]
GO
ALTER TABLE [dbo].[FedExMethods] ADD  DEFAULT ((0)) FOR [Priority]
GO
ALTER TABLE [dbo].[FedExMethods] ADD  DEFAULT ((0)) FOR [MethodHand]
GO
ALTER TABLE [dbo].[FedExMethods] ADD  DEFAULT ((0)) FOR [MethodWeight]
GO
ALTER TABLE [dbo].[Footer] ADD  DEFAULT ((1)) FOR [Display]
GO
ALTER TABLE [dbo].[Footer] ADD  DEFAULT ((0)) FOR [Menu_id]
GO
ALTER TABLE [dbo].[Footer] ADD  DEFAULT ((1)) FOR [SettingID]
GO
ALTER TABLE [dbo].[Footer] ADD  DEFAULT ((0)) FOR [Display_ContactInfo]
GO
ALTER TABLE [dbo].[Footer] ADD  DEFAULT ((0)) FOR [Display_SocialIcons]
GO
ALTER TABLE [dbo].[Footer] ADD  DEFAULT ((0)) FOR [Display_mailchimp_signup]
GO
ALTER TABLE [dbo].[Footer] ADD  DEFAULT ((0)) FOR [Display_constantcontact_signup]
GO
ALTER TABLE [dbo].[Footer] ADD  DEFAULT ((0)) FOR [Position]
GO
ALTER TABLE [dbo].[Gallery] ADD  DEFAULT ((300)) FOR [sm_image_width]
GO
ALTER TABLE [dbo].[Gallery] ADD  DEFAULT ((300)) FOR [sm_image_height]
GO
ALTER TABLE [dbo].[Gallery] ADD  DEFAULT ((800)) FOR [lg_image_width]
GO
ALTER TABLE [dbo].[Gallery] ADD  DEFAULT ((800)) FOR [lg_image_height]
GO
ALTER TABLE [dbo].[Gallery] ADD  DEFAULT ((1)) FOR [gallery_style]
GO
ALTER TABLE [dbo].[Gallery] ADD  DEFAULT ((0)) FOR [transition]
GO
ALTER TABLE [dbo].[Gallery] ADD  DEFAULT ((1)) FOR [convertToWebp]
GO
ALTER TABLE [dbo].[Gallery] ADD  DEFAULT ((9999)) FOR [priority]
GO
ALTER TABLE [dbo].[Gallery_category] ADD  DEFAULT ((9999)) FOR [priority]
GO
ALTER TABLE [dbo].[Gallery_Images] ADD  CONSTRAINT [DF__Gallery_I__targe__2B947552]  DEFAULT ((1)) FOR [target]
GO
ALTER TABLE [dbo].[Gallery_Images] ADD  CONSTRAINT [DF__Gallery_I__categ__2C88998B]  DEFAULT ((0)) FOR [category_id]
GO
ALTER TABLE [dbo].[Gallery_Images] ADD  CONSTRAINT [DF__Gallery_I__video__2D7CBDC4]  DEFAULT (NULL) FOR [video_mp4]
GO
ALTER TABLE [dbo].[Gallery_Images] ADD  CONSTRAINT [DF__Gallery_I__video__2E70E1FD]  DEFAULT (NULL) FOR [video_webm]
GO
ALTER TABLE [dbo].[Gallery_Images] ADD  CONSTRAINT [DF__Gallery_I__video__2F650636]  DEFAULT (NULL) FOR [video_ogg]
GO
ALTER TABLE [dbo].[Gallery_Images] ADD  CONSTRAINT [DF__Gallery_I__video__30592A6F]  DEFAULT (NULL) FOR [video_external]
GO
ALTER TABLE [dbo].[Gallery_Images] ADD  CONSTRAINT [DF__Gallery_I__video__314D4EA8]  DEFAULT ((0)) FOR [video_width]
GO
ALTER TABLE [dbo].[Gallery_Images] ADD  CONSTRAINT [DF__Gallery_I__video__324172E1]  DEFAULT ((0)) FOR [video_height]
GO
ALTER TABLE [dbo].[GiftItems] ADD  DEFAULT ((0)) FOR [Product_ID]
GO
ALTER TABLE [dbo].[GiftItems] ADD  DEFAULT ((0)) FOR [AddonMultP]
GO
ALTER TABLE [dbo].[GiftItems] ADD  DEFAULT ((0)) FOR [AddonNonMultP]
GO
ALTER TABLE [dbo].[GiftItems] ADD  DEFAULT ((0)) FOR [AddonMultW]
GO
ALTER TABLE [dbo].[GiftItems] ADD  DEFAULT ((0)) FOR [AddonNonMultW]
GO
ALTER TABLE [dbo].[GiftItems] ADD  DEFAULT ((0)) FOR [OptPrice]
GO
ALTER TABLE [dbo].[GiftItems] ADD  DEFAULT ((0)) FOR [OptWeight]
GO
ALTER TABLE [dbo].[GiftItems] ADD  DEFAULT ((0)) FOR [OptQuant]
GO
ALTER TABLE [dbo].[GiftItems] ADD  DEFAULT ((0)) FOR [OptChoice]
GO
ALTER TABLE [dbo].[GiftItems] ADD  DEFAULT ((0)) FOR [Price]
GO
ALTER TABLE [dbo].[GiftItems] ADD  DEFAULT ((0)) FOR [Weight]
GO
ALTER TABLE [dbo].[GiftItems] ADD  DEFAULT ((0)) FOR [Quantity_Requested]
GO
ALTER TABLE [dbo].[GiftItems] ADD  DEFAULT ((0)) FOR [Quantity_Purchased]
GO
ALTER TABLE [dbo].[GiftRegistry] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[GiftRegistry] ADD  DEFAULT ((0)) FOR [Private]
GO
ALTER TABLE [dbo].[GiftRegistry] ADD  DEFAULT ((0)) FOR [Order_Notification]
GO
ALTER TABLE [dbo].[GiftRegistry] ADD  DEFAULT ((0)) FOR [Live]
GO
ALTER TABLE [dbo].[GiftRegistry] ADD  DEFAULT ((0)) FOR [Approved]
GO
ALTER TABLE [dbo].[Giftwrap] ADD  DEFAULT ((0)) FOR [Price]
GO
ALTER TABLE [dbo].[Giftwrap] ADD  DEFAULT ((0)) FOR [Weight]
GO
ALTER TABLE [dbo].[Giftwrap] ADD  DEFAULT ((0)) FOR [Priority]
GO
ALTER TABLE [dbo].[Giftwrap] ADD  DEFAULT ((0)) FOR [Display]
GO
ALTER TABLE [dbo].[Groups] ADD  DEFAULT ((0)) FOR [Wholesale]
GO
ALTER TABLE [dbo].[Groups] ADD  DEFAULT ((0)) FOR [TaxExempt]
GO
ALTER TABLE [dbo].[Groups] ADD  DEFAULT ((0)) FOR [ShipExempt]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((1)) FOR [ID]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Gallery_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Gallery_id]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Gallery_transition]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Gallery_max]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Gallery_priority]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Gallery_fullwidth]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Gallery_over_menu]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Gallery_height]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Gallery2_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Gallery2_id]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Gallery2_transition]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Gallery2_max]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Gallery2_priority]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Topcats_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Topcats_allcats]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((4)) FOR [Topcats_cols]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Topcats_priority]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Carousel_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('Popular Products') FOR [Carousel_name]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('NEW') FOR [Carousel_selectors]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Carousel_priority]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Masonry_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('Popular Products') FOR [Masonry_name]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('NEW') FOR [Masonry_selectors]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Masonry_priority]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Blog_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((3)) FOR [Blog_cols]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('Recent Posts') FOR [Blog_name]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Blog_priority]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Alert_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Alert_priority]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Alert_fullwidth]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Hero_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Hero_text_position]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Hero_over_menu]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('400') FOR [Hero_height]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Hero_priority]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('0') FOR [Testimonial_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('99') FOR [Testimonial_priority]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('0') FOR [Testimonial_fullwidth]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('0') FOR [Testimonial_product_id]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('0') FOR [Testimonial_list_id]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('0') FOR [Product_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('0') FOR [Product_fullwidth]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('1') FOR [Product_style]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ('99') FOR [Product_priority]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Custom_text_1_priority]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Custom_text_1_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Custom_text_1_fullwidth]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Custom_text_2_priority]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Custom_text_2_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Custom_text_2_fullwidth]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Custom_text_3_priority]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Custom_text_3_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Custom_text_3_fullwidth]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Contact_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Contact_priority]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((0)) FOR [Custom_code_1_display]
GO
ALTER TABLE [dbo].[Homepage] ADD  DEFAULT ((99)) FOR [Custom_code_1_priority]
GO
ALTER TABLE [dbo].[lightspeed_settings] ADD  DEFAULT ((0)) FOR [ShopId]
GO
ALTER TABLE [dbo].[lightspeed_settings] ADD  DEFAULT ((0)) FOR [Scheduled]
GO
ALTER TABLE [dbo].[lightspeed_settings] ADD  DEFAULT ((0)) FOR [total]
GO
ALTER TABLE [dbo].[lightspeed_settings] ADD  DEFAULT ((0)) FOR [offset]
GO
ALTER TABLE [dbo].[lightspeed_settings] ADD  DEFAULT ((0)) FOR [test]
GO
ALTER TABLE [dbo].[lightspeed_settings] ADD  DEFAULT ((0)) FOR [importScheduled]
GO
ALTER TABLE [dbo].[lightspeed_settings] ADD  DEFAULT ('https://www.nucomwebhosting.com') FOR [NucomServicesURL]
GO
ALTER TABLE [dbo].[LightSpeedData] ADD  DEFAULT ((0)) FOR [updateCount]
GO
ALTER TABLE [dbo].[LightSpeedData] ADD  DEFAULT ((0)) FOR [Deleted]
GO
ALTER TABLE [dbo].[LightSpeedData] ADD  DEFAULT ((0)) FOR [RetryCount]
GO
ALTER TABLE [dbo].[List] ADD  DEFAULT ((0)) FOR [List_style]
GO
ALTER TABLE [dbo].[List_Category] ADD  DEFAULT ((9999)) FOR [priority]
GO
ALTER TABLE [dbo].[List_questions] ADD  DEFAULT ((1)) FOR [display]
GO
ALTER TABLE [dbo].[List_questions] ADD  DEFAULT ((0)) FOR [category_id]
GO
ALTER TABLE [dbo].[LocalTax] ADD  DEFAULT ((0)) FOR [Code_ID]
GO
ALTER TABLE [dbo].[LocalTax] ADD  DEFAULT ((0)) FOR [Tax]
GO
ALTER TABLE [dbo].[LocalTax] ADD  DEFAULT ((0)) FOR [TaxShip]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT ('0') FOR [order_no]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT (NULL) FOR [status]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT ('0') FOR [type]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT (NULL) FOR [code]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT (NULL) FOR [message]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT (NULL) FOR [custom1]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT (NULL) FOR [custom2]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT (NULL) FOR [custom3]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT ('0') FOR [RowNo]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT (NULL) FOR [ErrorType]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT (NULL) FOR [FileName]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT (NULL) FOR [FilePath]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT (NULL) FOR [SKU]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT ((0)) FOR [display]
GO
ALTER TABLE [dbo].[Log] ADD  DEFAULT ((0)) FOR [flag]
GO
ALTER TABLE [dbo].[Log_type] ADD  DEFAULT (NULL) FOR [name]
GO
ALTER TABLE [dbo].[Log_type] ADD  DEFAULT ((0)) FOR [Priority]
GO
ALTER TABLE [dbo].[mailchimp_settings] ADD  DEFAULT ((1)) FOR [Mailchimp_ID]
GO
ALTER TABLE [dbo].[mailchimp_settings] ADD  DEFAULT ((1)) FOR [SettingID]
GO
ALTER TABLE [dbo].[mailchimp_settings] ADD  DEFAULT ((0)) FOR [APIKey]
GO
ALTER TABLE [dbo].[mailchimp_settings] ADD  DEFAULT (NULL) FOR [ListID]
GO
ALTER TABLE [dbo].[mailchimp_settings] ADD  DEFAULT ('https://www.nucomwebhosting.com') FOR [NucomServicesURL]
GO
ALTER TABLE [dbo].[mailchimp_settings] ADD  DEFAULT ((0)) FOR [Subscribe_guests]
GO
ALTER TABLE [dbo].[MailText] ADD  DEFAULT ((0)) FOR [System]
GO
ALTER TABLE [dbo].[Memberships] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[Memberships] ADD  DEFAULT ((0)) FOR [Product_ID]
GO
ALTER TABLE [dbo].[Memberships] ADD  DEFAULT ((0)) FOR [Time_Count]
GO
ALTER TABLE [dbo].[Memberships] ADD  DEFAULT ((0)) FOR [Access_Count]
GO
ALTER TABLE [dbo].[Memberships] ADD  DEFAULT ((0)) FOR [Valid]
GO
ALTER TABLE [dbo].[Memberships] ADD  DEFAULT ((0)) FOR [Access_Used]
GO
ALTER TABLE [dbo].[Memberships] ADD  DEFAULT ((0)) FOR [Recur]
GO
ALTER TABLE [dbo].[Memberships] ADD  DEFAULT ((0)) FOR [Recur_Product_ID]
GO
ALTER TABLE [dbo].[Memberships] ADD  DEFAULT ((0)) FOR [Next_Membership_ID]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [Product_ID]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [AddonMultP]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [AddonNonMultP]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [Price]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [Per_Item_Weight]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [Quantity]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [Quantity_Shipped]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [OptPrice]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [OptQuant]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [PromoAmount]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [PromoQuant]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [Dropship_Qty]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [Dropship_Cost]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [Editable]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [SKU_ID]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [Hide_in_Cart]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [Subscription]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [Subscription_discount]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [Subscription_period]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [PackageParent]
GO
ALTER TABLE [dbo].[Order_Items] ADD  DEFAULT ((0)) FOR [Category_id]
GO
ALTER TABLE [dbo].[Order_Items] ADD  CONSTRAINT [DF_Order_Items_Gift]  DEFAULT ((0)) FOR [Gift]
GO
ALTER TABLE [dbo].[Order_Items_Quote] ADD  DEFAULT ((0)) FOR [Order_No]
GO
ALTER TABLE [dbo].[Order_Items_Quote] ADD  DEFAULT ((0)) FOR [Item_ID]
GO
ALTER TABLE [dbo].[Order_Items_Quote] ADD  DEFAULT ((0)) FOR [Product_ID]
GO
ALTER TABLE [dbo].[Order_Items_Quote] ADD  DEFAULT ((0)) FOR [Price]
GO
ALTER TABLE [dbo].[Order_Items_Quote] ADD  DEFAULT ((0)) FOR [Quantity]
GO
ALTER TABLE [dbo].[Order_Items_Quote] ADD  DEFAULT ((0)) FOR [Quantity_Shipped]
GO
ALTER TABLE [dbo].[Order_Items_Quote] ADD  DEFAULT ((0)) FOR [OptPrice]
GO
ALTER TABLE [dbo].[Order_Items_Quote] ADD  DEFAULT ((0)) FOR [OptQuant]
GO
ALTER TABLE [dbo].[Order_Items_Quote] ADD  DEFAULT ((0)) FOR [PackageParent]
GO
ALTER TABLE [dbo].[Order_Items_Quote] ADD  DEFAULT ((0)) FOR [Category_id]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [Order_No]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [Item_ID]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [Product_ID]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [Price]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [Quantity]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [Quantity_Shipped]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [OptPrice]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [OptQuant]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [OptChoice]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [Per_Item_Weight]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [Hide_in_Cart]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [Subscription_period]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [Subscription_discount]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [PackageParent]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [Category_id]
GO
ALTER TABLE [dbo].[Order_Items_refund] ADD  DEFAULT ((0)) FOR [REFUNDPROCESSED]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Filled]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Process]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Void]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Paid]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Customer_ID]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [ShipTo]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Card_ID]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [OrderTotal]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [OriginalTotal]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Tax]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [OrderDisc]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Credits]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [AddonTotal]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Weight]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Shipping]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Actual_shipping]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Freight]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [ShippingDisc]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Abandoned]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [AdminUser_ID]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [AdminCredit]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Printed_Quote]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Printed_Inv]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Printed_Pack]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((1)) FOR [SettingID]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [InvDone]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [CodesSent]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [IsAddressVerified]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [QB_export]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [QB_Customer_ID]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [QBProcess]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Amazon_Order_Filled]
GO
ALTER TABLE [dbo].[Order_No] ADD  DEFAULT ((0)) FOR [Subscribe_SMS_shipping]
GO
ALTER TABLE [dbo].[Order_No] ADD  CONSTRAINT [DF_Order_No_ProductReview_Email_Request_Sent]  DEFAULT ((0)) FOR [ProductReview_Email_Request_Sent]
GO
ALTER TABLE [dbo].[Order_No] ADD  CONSTRAINT [DF_Order_No_ProductReview_SMS_Request_Sent]  DEFAULT ((0)) FOR [ProductReview_SMS_Request_Sent]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Filled]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Process]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Void]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [InvDone]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Customer_ID]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Card_ID]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [ShipTo]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [OriginalTotal]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [OrderTotal]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Tax]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Shipping]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Freight]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Weight]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [AdminUser_ID]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Printed]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Printed_Inv]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Printed_Pack]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Printed_quote]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Paid]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [CodesSent]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((1)) FOR [SettingID]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [QB_export]
GO
ALTER TABLE [dbo].[Order_No_Quote] ADD  DEFAULT ((0)) FOR [Subscribe_SMS_shipping]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Order_No]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Filled]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Process]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Void]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [InvDone]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Customer_ID]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Card_ID]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [ShipTo]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [OriginalTotal]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [OrderTotal]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Tax]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Shipping]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Freight]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Weight]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [AdminUser_ID]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Printed]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Printed_Inv]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Printed_Pack]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Printed_quote]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Paid]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [CodesSent]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((1)) FOR [SettingID]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [QB_export]
GO
ALTER TABLE [dbo].[Order_No_Refund] ADD  DEFAULT ((0)) FOR [Subscribe_SMS_shipping]
GO
ALTER TABLE [dbo].[Order_PO] ADD  DEFAULT ((0)) FOR [Account_ID]
GO
ALTER TABLE [dbo].[Order_PO] ADD  DEFAULT ((0)) FOR [PO_Shipto]
GO
ALTER TABLE [dbo].[Order_PO] ADD  DEFAULT ((0)) FOR [PO_Open]
GO
ALTER TABLE [dbo].[orders_email] ADD  DEFAULT (NULL) FOR [notes]
GO
ALTER TABLE [dbo].[orders_email] ADD  DEFAULT (getdate()) FOR [enterdate]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Setti__48EFCE0F]  DEFAULT ((1)) FOR [SettingID]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Allow__49E3F248]  DEFAULT ((0)) FOR [AllowPO]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Allow__4AD81681]  DEFAULT ((0)) FOR [AllowQuote]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Allow__4BCC3ABA]  DEFAULT ((0)) FOR [AllowInt]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Allow__4CC05EF3]  DEFAULT ((0)) FOR [AllowOffline]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__OnlyO__4DB4832C]  DEFAULT ((0)) FOR [OnlyOffline]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__CCPro__4EA8A765]  DEFAULT ((1)) FOR [CCProcessID]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__useAC__4F9CCB9E]  DEFAULT ((0)) FOR [useACH]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Email__5090EFD7]  DEFAULT ((0)) FOR [EmailAdmin]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Email__51851410]  DEFAULT ((0)) FOR [EmailUser]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Email__52793849]  DEFAULT ((0)) FOR [EmailAffs]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Email__536D5C82]  DEFAULT ((0)) FOR [EmailDrop]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Giftc__546180BB]  DEFAULT ((0)) FOR [Giftcard]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Deliv__5555A4F4]  DEFAULT ((0)) FOR [Delivery]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Coupo__5649C92D]  DEFAULT ((0)) FOR [Coupons]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Backo__573DED66]  DEFAULT ((0)) FOR [Backorders]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__BaseO__5832119F]  DEFAULT ((0)) FOR [BaseOrderNum]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Store__592635D8]  DEFAULT ((0)) FOR [StoreCardInfo]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__MinTo__5A1A5A11]  DEFAULT ((0)) FOR [MinTotal]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__MinTo__5B0E7E4A]  DEFAULT ((0)) FOR [MinTotal_wholesale]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF_OrderSettings_ShowTermsInCheckout]  DEFAULT ((0)) FOR [ShowTermsInCheckout]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__Giftw__5C02A283]  DEFAULT ((0)) FOR [Giftwrap]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__UseCV__5CF6C6BC]  DEFAULT ((0)) FOR [UseCVV2]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__NoGue__5DEAEAF5]  DEFAULT ((0)) FOR [NoGuests]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__UseBi__5EDF0F2E]  DEFAULT ((0)) FOR [UseBilling]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__ShowB__5FD33367]  DEFAULT ((1)) FOR [ShowBasket]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__ShowS__60C757A0]  DEFAULT ((1)) FOR [ShowSFL]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__ShowR__61BB7BD9]  DEFAULT ((1)) FOR [ShowRAC]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__SkipA__62AFA012]  DEFAULT ((0)) FOR [SkipAddressForm]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__UsePa__63A3C44B]  DEFAULT ((0)) FOR [UsePayPal]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__PayPa__6497E884]  DEFAULT ((0)) FOR [PayPalLog]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF__OrderSett__TaxMe__658C0CBD]  DEFAULT ((0)) FOR [TaxMethod]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF_OrderSettings_AllowGoogleAutoComplete]  DEFAULT ((1)) FOR [AllowGoogleAutoComplete]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF_OrderSettings_AllowGoogleValidateAddress]  DEFAULT ((0)) FOR [AllowGoogleValidateAddress]
GO
ALTER TABLE [dbo].[OrderSettings] ADD  CONSTRAINT [DF_OrderSettings_AllowBadAddress]  DEFAULT ((0)) FOR [AllowBadAddress]
GO
ALTER TABLE [dbo].[OrderTaxes] ADD  DEFAULT ((0)) FOR [Order_No]
GO
ALTER TABLE [dbo].[OrderTaxes] ADD  DEFAULT ((0)) FOR [Code_ID]
GO
ALTER TABLE [dbo].[OrderTaxes] ADD  DEFAULT ((0)) FOR [ProductTotal]
GO
ALTER TABLE [dbo].[OrderTaxes] ADD  DEFAULT ((0)) FOR [AllUserTax]
GO
ALTER TABLE [dbo].[OrderTaxes] ADD  DEFAULT ((0)) FOR [StateTax]
GO
ALTER TABLE [dbo].[OrderTaxes] ADD  DEFAULT ((0)) FOR [CountyTax]
GO
ALTER TABLE [dbo].[OrderTaxes] ADD  DEFAULT ((0)) FOR [LocalTax]
GO
ALTER TABLE [dbo].[OrderTaxes] ADD  DEFAULT ((0)) FOR [CountryTax]
GO
ALTER TABLE [dbo].[Pages] ADD  DEFAULT ((0)) FOR [CatCore_ID]
GO
ALTER TABLE [dbo].[Pages] ADD  DEFAULT ((0)) FOR [Display]
GO
ALTER TABLE [dbo].[Pages] ADD  DEFAULT ((0)) FOR [Display_Menu]
GO
ALTER TABLE [dbo].[Pages] ADD  DEFAULT ((0)) FOR [Display_Mobile]
GO
ALTER TABLE [dbo].[Pages] ADD  DEFAULT ((0)) FOR [ShowTextFirst]
GO
ALTER TABLE [dbo].[Pages] ADD  DEFAULT ((0)) FOR [System]
GO
ALTER TABLE [dbo].[Pages] ADD  DEFAULT ((0)) FOR [AccessKey]
GO
ALTER TABLE [dbo].[Pages] ADD  DEFAULT ((9999)) FOR [Priority]
GO
ALTER TABLE [dbo].[Pages] ADD  DEFAULT ((0)) FOR [Parent_ID]
GO
ALTER TABLE [dbo].[Pages] ADD  DEFAULT ((0)) FOR [Title_Priority]
GO
ALTER TABLE [dbo].[Payment] ADD  DEFAULT ((0)) FOR [Amount]
GO
ALTER TABLE [dbo].[Payment] ADD  DEFAULT ((0)) FOR [Voided]
GO
ALTER TABLE [dbo].[Payment] ADD  DEFAULT ((0)) FOR [ExpressRefunded]
GO
ALTER TABLE [dbo].[Payment] ADD  DEFAULT ((0)) FOR [OrgAmount]
GO
ALTER TABLE [dbo].[Payment] ADD  DEFAULT ((1)) FOR [SettingID]
GO
ALTER TABLE [dbo].[Permissions] ADD  DEFAULT ((0)) FOR [BitValue]
GO
ALTER TABLE [dbo].[POS_settings] ADD  DEFAULT ((0)) FOR [Display]
GO
ALTER TABLE [dbo].[POS_settings] ADD  DEFAULT ((0)) FOR [PayInvoiceProduct_id]
GO
ALTER TABLE [dbo].[POS_settings] ADD  DEFAULT ((0)) FOR [PayInvoiceAddon1]
GO
ALTER TABLE [dbo].[POS_settings] ADD  DEFAULT ((0)) FOR [PayInvoiceAddon2]
GO
ALTER TABLE [dbo].[Prod_CustomFields] ADD  DEFAULT ((0)) FOR [Custom_Display]
GO
ALTER TABLE [dbo].[Prod_CustomFields] ADD  DEFAULT ((0)) FOR [Google_Use]
GO
ALTER TABLE [dbo].[Prod_SKU_Combos] ADD  DEFAULT ((0)) FOR [SKU_ID]
GO
ALTER TABLE [dbo].[Prod_SKU_Combos] ADD  DEFAULT ((0)) FOR [Option_ID]
GO
ALTER TABLE [dbo].[Prod_SKU_Combos] ADD  DEFAULT ((0)) FOR [Choice_ID]
GO
ALTER TABLE [dbo].[Prod_SKU_Combos] ADD  DEFAULT ((0)) FOR [Parent_ID]
GO
ALTER TABLE [dbo].[Prod_SKU_Combos] ADD  DEFAULT ((0)) FOR [SortOrder]
GO
ALTER TABLE [dbo].[ProdAddons] ADD  DEFAULT ('0') FOR [ProductOptionId]
GO
ALTER TABLE [dbo].[ProdAddons] ADD  DEFAULT ((0)) FOR [addon_stdid]
GO
ALTER TABLE [dbo].[ProdAddons] ADD  DEFAULT ((1)) FOR [Display]
GO
ALTER TABLE [dbo].[ProdAddons] ADD  DEFAULT ((9999)) FOR [Priority]
GO
ALTER TABLE [dbo].[ProdAddons] ADD  DEFAULT ((0)) FOR [Weight]
GO
ALTER TABLE [dbo].[ProdAddons] ADD  DEFAULT ((0)) FOR [ProdMult]
GO
ALTER TABLE [dbo].[ProdAddons] ADD  DEFAULT ((0)) FOR [Required]
GO
ALTER TABLE [dbo].[ProdDisc] ADD  DEFAULT ((0)) FOR [Wholesale]
GO
ALTER TABLE [dbo].[ProdDisc] ADD  DEFAULT ((0)) FOR [QuantFrom]
GO
ALTER TABLE [dbo].[ProdDisc] ADD  DEFAULT ((0)) FOR [QuantTo]
GO
ALTER TABLE [dbo].[ProdDisc] ADD  DEFAULT ((0)) FOR [DiscountPer]
GO
ALTER TABLE [dbo].[ProdDisc] ADD  DEFAULT ((0)) FOR [Type]
GO
ALTER TABLE [dbo].[ProdDisc] ADD  DEFAULT ((1)) FOR [Display]
GO
ALTER TABLE [dbo].[ProdGrpPrice] ADD  DEFAULT ((0)) FOR [Price]
GO
ALTER TABLE [dbo].[ProdOpt_Choices] ADD  DEFAULT ((0)) FOR [Option_ID]
GO
ALTER TABLE [dbo].[ProdOpt_Choices] ADD  DEFAULT ((0)) FOR [Choice_ID]
GO
ALTER TABLE [dbo].[ProdOpt_Choices] ADD  DEFAULT ((0)) FOR [Price]
GO
ALTER TABLE [dbo].[ProdOpt_Choices] ADD  DEFAULT ((0)) FOR [Price_Wholesale]
GO
ALTER TABLE [dbo].[ProdOpt_Choices] ADD  DEFAULT ((0)) FOR [Weight]
GO
ALTER TABLE [dbo].[ProdOpt_Choices] ADD  DEFAULT ((0)) FOR [NumInStock]
GO
ALTER TABLE [dbo].[ProdOpt_Choices] ADD  DEFAULT ((0)) FOR [Display]
GO
ALTER TABLE [dbo].[ProdOpt_Choices] ADD  DEFAULT ((0)) FOR [SortOrder]
GO
ALTER TABLE [dbo].[ProdOpt_Choices] ADD  DEFAULT ((0)) FOR [ParentOptionChoiceID]
GO
ALTER TABLE [dbo].[prodtypeparam_answer_map] ADD  DEFAULT ('0') FOR [Param_ID]
GO
ALTER TABLE [dbo].[prodtypeparam_answer_map] ADD  DEFAULT ('0') FOR [AnswerId]
GO
ALTER TABLE [dbo].[prodtypeparam_answers] ADD  DEFAULT (NULL) FOR [Answers]
GO
ALTER TABLE [dbo].[prodtypeparam_answers] ADD  DEFAULT (NULL) FOR [Priority]
GO
ALTER TABLE [dbo].[prodtypeparam_product] ADD  DEFAULT ('0') FOR [Product_ID]
GO
ALTER TABLE [dbo].[prodtypeparam_product] ADD  DEFAULT ('0') FOR [ProdTypeParam_ID]
GO
ALTER TABLE [dbo].[prodtypeparam_product] ADD  DEFAULT (NULL) FOR [ParamValue]
GO
ALTER TABLE [dbo].[prodtypeparam_product] ADD  DEFAULT (NULL) FOR [AnswerId]
GO
ALTER TABLE [dbo].[prodtypeparams] ADD  DEFAULT ('0') FOR [ProdTypeParam_ID]
GO
ALTER TABLE [dbo].[prodtypeparams] ADD  DEFAULT ('0') FOR [ProdType_ID]
GO
ALTER TABLE [dbo].[prodtypeparams] ADD  DEFAULT (NULL) FOR [Question]
GO
ALTER TABLE [dbo].[prodtypeparams] ADD  DEFAULT ('0') FOR [Priority]
GO
ALTER TABLE [dbo].[prodtypeparams] ADD  DEFAULT ('1') FOR [Display]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT ('0') FOR [ProdType_ID]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT (NULL) FOR [TypeName]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT ('0') FOR [Shippable]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT ('0') FOR [Downloadable]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT ('0') FOR [Membership]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT ('0') FOR [GroupPricing]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT ('0') FOR [QuantityDiscounts]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT ('0') FOR [Options]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT ('0') FOR [Addons]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT ('0') FOR [Images]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT ('0') FOR [Specifications]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT ('0') FOR [AdvSearch]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT ('0') FOR [Reviewable]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT (NULL) FOR [Personalization]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT (NULL) FOR [Performance]
GO
ALTER TABLE [dbo].[prodtypes] ADD  DEFAULT (NULL) FOR [Listing]
GO
ALTER TABLE [dbo].[prodtypespec_product] ADD  DEFAULT ('0') FOR [Product_ID]
GO
ALTER TABLE [dbo].[prodtypespec_product] ADD  DEFAULT ('0') FOR [ProdTypeSpec_ID]
GO
ALTER TABLE [dbo].[prodtypespec_product] ADD  DEFAULT (NULL) FOR [SpecValue]
GO
ALTER TABLE [dbo].[prodtypespecs] ADD  DEFAULT ('0') FOR [ProdTypeSpec_ID]
GO
ALTER TABLE [dbo].[prodtypespecs] ADD  DEFAULT ('0') FOR [ProdType_ID]
GO
ALTER TABLE [dbo].[prodtypespecs] ADD  DEFAULT ('0') FOR [IsTitle]
GO
ALTER TABLE [dbo].[prodtypespecs] ADD  DEFAULT ('9999') FOR [Priority]
GO
ALTER TABLE [dbo].[prodtypespecs] ADD  DEFAULT (NULL) FOR [IsGoogle]
GO
ALTER TABLE [dbo].[Product_files] ADD  DEFAULT ((0)) FOR [Product_id]
GO
ALTER TABLE [dbo].[Product_files] ADD  DEFAULT ((0)) FOR [Category_id]
GO
ALTER TABLE [dbo].[Product_files] ADD  DEFAULT ((9999)) FOR [Priority]
GO
ALTER TABLE [dbo].[Product_Images] ADD  DEFAULT ((0)) FOR [Priority]
GO
ALTER TABLE [dbo].[Product_Options] ADD  DEFAULT ((0)) FOR [Std_ID]
GO
ALTER TABLE [dbo].[Product_Options] ADD  DEFAULT ((0)) FOR [Display]
GO
ALTER TABLE [dbo].[Product_Options] ADD  DEFAULT ((1)) FOR [ColorDisplay]
GO
ALTER TABLE [dbo].[Product_Options] ADD  DEFAULT ((0)) FOR [UseOptImageInCart]
GO
ALTER TABLE [dbo].[Product_Options] ADD  DEFAULT ((0)) FOR [IsParent]
GO
ALTER TABLE [dbo].[Product_Options] ADD  DEFAULT ((0)) FOR [Priority]
GO
ALTER TABLE [dbo].[Product_Options] ADD  DEFAULT ((0)) FOR [TrackInv]
GO
ALTER TABLE [dbo].[Product_Options] ADD  DEFAULT ((0)) FOR [Required]
GO
ALTER TABLE [dbo].[Product_Package] ADD  DEFAULT ((0)) FOR [Parent_id]
GO
ALTER TABLE [dbo].[Product_Package] ADD  DEFAULT ((0)) FOR [DynamicPricing]
GO
ALTER TABLE [dbo].[Product_Package] ADD  DEFAULT ((0)) FOR [showImage]
GO
ALTER TABLE [dbo].[Product_Package] ADD  DEFAULT ((0)) FOR [showPrice]
GO
ALTER TABLE [dbo].[Product_Package] ADD  DEFAULT ((0)) FOR [showSKU]
GO
ALTER TABLE [dbo].[Product_Package] ADD  DEFAULT ((0)) FOR [showDesc]
GO
ALTER TABLE [dbo].[Product_Package] ADD  DEFAULT ((0)) FOR [showQty]
GO
ALTER TABLE [dbo].[Product_Package] ADD  DEFAULT ((0)) FOR [Min_order]
GO
ALTER TABLE [dbo].[Product_Package] ADD  DEFAULT ((0)) FOR [Max_order]
GO
ALTER TABLE [dbo].[Product_Package] ADD  DEFAULT ((0)) FOR [optionsOnly]
GO
ALTER TABLE [dbo].[Product_Package_Products] ADD  DEFAULT ((0)) FOR [Package_id]
GO
ALTER TABLE [dbo].[Product_Package_Products] ADD  DEFAULT ((0)) FOR [Product_id]
GO
ALTER TABLE [dbo].[Product_Package_Products] ADD  DEFAULT ((9999)) FOR [Priority]
GO
ALTER TABLE [dbo].[Product_SKUs] ADD  DEFAULT ((0)) FOR [Product_ID]
GO
ALTER TABLE [dbo].[Product_SKUs] ADD  DEFAULT ((0)) FOR [Display]
GO
ALTER TABLE [dbo].[Product_SKUs] ADD  DEFAULT ((0)) FOR [Override]
GO
ALTER TABLE [dbo].[Product_SKUs] ADD  DEFAULT ((0)) FOR [SortOrder]
GO
ALTER TABLE [dbo].[Product_SKUs] ADD  DEFAULT ((0)) FOR [NumInStock]
GO
ALTER TABLE [dbo].[Product_SKUs] ADD  DEFAULT ((0)) FOR [Weight]
GO
ALTER TABLE [dbo].[Product_SKUs] ADD  DEFAULT ((0)) FOR [Price]
GO
ALTER TABLE [dbo].[Product_SKUs] ADD  DEFAULT ((0)) FOR [Active]
GO
ALTER TABLE [dbo].[Product_videos] ADD  DEFAULT ('0') FOR [product_id]
GO
ALTER TABLE [dbo].[Product_videos] ADD  DEFAULT ('0') FOR [priority]
GO
ALTER TABLE [dbo].[Product_videos] ADD  DEFAULT ('0') FOR [video_width]
GO
ALTER TABLE [dbo].[Product_videos] ADD  DEFAULT ('0') FOR [video_height]
GO
ALTER TABLE [dbo].[ProductReviews] ADD  CONSTRAINT [DF_ProductReviews_Order_no]  DEFAULT ((0)) FOR [Order_no]
GO
ALTER TABLE [dbo].[ProductReviews] ADD  CONSTRAINT [DF__ProductRe__User___5BCD9859]  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[ProductReviews] ADD  CONSTRAINT [DF__ProductRe__Anony__5CC1BC92]  DEFAULT ((0)) FOR [Anonymous]
GO
ALTER TABLE [dbo].[ProductReviews] ADD  CONSTRAINT [DF__ProductRe__Ratin__5DB5E0CB]  DEFAULT ((0)) FOR [Rating]
GO
ALTER TABLE [dbo].[ProductReviews] ADD  CONSTRAINT [DF__ProductRe__Recom__5EAA0504]  DEFAULT ((0)) FOR [Recommend]
GO
ALTER TABLE [dbo].[ProductReviews] ADD  CONSTRAINT [DF__ProductRe__Appro__5F9E293D]  DEFAULT ((0)) FOR [Approved]
GO
ALTER TABLE [dbo].[ProductReviews] ADD  CONSTRAINT [DF__ProductRe__Needs__60924D76]  DEFAULT ((0)) FOR [NeedsCheck]
GO
ALTER TABLE [dbo].[ProductReviews] ADD  CONSTRAINT [DF__ProductRe__Helpf__618671AF]  DEFAULT ((0)) FOR [Helpful_Total]
GO
ALTER TABLE [dbo].[ProductReviews] ADD  CONSTRAINT [DF__ProductRe__Helpf__627A95E8]  DEFAULT ((0)) FOR [Helpful_Yes]
GO
ALTER TABLE [dbo].[ProductReviews_ContactCount] ADD  DEFAULT ((0)) FOR [Order_no]
GO
ALTER TABLE [dbo].[ProductReviews_ContactCount] ADD  DEFAULT ((0)) FOR [Product_id]
GO
ALTER TABLE [dbo].[ProductReviews_ContactCount] ADD  DEFAULT (getdate()) FOR [DateCreated]
GO
ALTER TABLE [dbo].[ProductReviewsHelpful] ADD  DEFAULT ((0)) FOR [Helpful]
GO
ALTER TABLE [dbo].[ProductReviewsHelpful] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Long_D__05A3D694]  DEFAULT ((0)) FOR [Long_Desc_position]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Conten__0697FACD]  DEFAULT ((0)) FOR [Content_style]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Retail__078C1F06]  DEFAULT ((0)) FOR [Retail_Price]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Base_P__0880433F]  DEFAULT ((0)) FOR [Base_Price]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Wholes__09746778]  DEFAULT ((0)) FOR [Wholesale]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__MAP_Pr__0A688BB1]  DEFAULT ((0)) FOR [MAP_Price]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Dropsh__0B5CAFEA]  DEFAULT ((0)) FOR [Dropship_Cost]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Item_h__0C50D423]  DEFAULT ((0)) FOR [Item_handling]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Weight__0D44F85C]  DEFAULT ((0)) FOR [Weight]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Shippi__0E391C95]  DEFAULT ((1)) FOR [Shipping]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF_Products_Shipping_Quote]  DEFAULT ((0)) FOR [Shipping_Quote]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Hazard__0F2D40CE]  DEFAULT ((0)) FOR [Hazardous]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Access__10216507]  DEFAULT ((0)) FOR [AccessKey]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__POSOnl__11158940]  DEFAULT ((0)) FOR [POSOnly]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Packag__1209AD79]  DEFAULT ((0)) FOR [PackageOnly]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Galler__12FDD1B2]  DEFAULT ((0)) FOR [Gallery_image_style]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Displa__13F1F5EB]  DEFAULT ((1)) FOR [Display]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Priori__14E61A24]  DEFAULT ((9999)) FOR [Priority]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Popula__15DA3E5D]  DEFAULT ((1)) FOR [Popularity]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__NumInS__16CE6296]  DEFAULT ((0)) FOR [NumInStock]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__ShowPr__17C286CF]  DEFAULT ((1)) FOR [ShowProdOnSub1]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__CheckI__18B6AB08]  DEFAULT ((1)) FOR [CheckInventory1]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__ShowOr__19AACF41]  DEFAULT ((1)) FOR [ShowOrderBox]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__ShowPr__1A9EF37A]  DEFAULT ((1)) FOR [ShowPrice]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__ShowPr__1B9317B3]  DEFAULT ((1)) FOR [ShowPriceRange]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__ShowDi__1C873BEC]  DEFAULT ((1)) FOR [ShowDiscounts]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__ShowPr__1D7B6025]  DEFAULT ((0)) FOR [ShowPromotions]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__ShowQu__1E6F845E]  DEFAULT ((2)) FOR [ShowQuantity]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Highli__1F63A897]  DEFAULT ((0)) FOR [Highlight]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__NotSol__2057CCD0]  DEFAULT ((0)) FOR [NotSold]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Review__214BF109]  DEFAULT ((0)) FOR [Reviewable]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Usefor__22401542]  DEFAULT ((0)) FOR [UseforPOTD]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Sale__2334397B]  DEFAULT ((0)) FOR [Sale]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Hot__24285DB4]  DEFAULT ((0)) FOR [Hot]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__TotalS__251C81ED]  DEFAULT ((0)) FOR [TotalSold]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__OptQua__2610A626]  DEFAULT ((0)) FOR [OptQuant]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Reorde__2704CA5F]  DEFAULT ((0)) FOR [Reorder_Level]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Min_Or__27F8EE98]  DEFAULT ((0)) FOR [Min_Order]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Mult_M__28ED12D1]  DEFAULT ((0)) FOR [Mult_Min]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Accoun__29E1370A]  DEFAULT ((0)) FOR [Account_ID]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Mfg_Ac__2AD55B43]  DEFAULT ((0)) FOR [Mfg_Account_ID]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__ProdTy__2BC97F7C]  DEFAULT ((0)) FOR [ProdType_ID]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Subscr__2CBDA3B5]  DEFAULT ((0)) FOR [Subscription]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Subscr__2DB1C7EE]  DEFAULT ((0)) FOR [Subscription_discount]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Access__2EA5EC27]  DEFAULT ((0)) FOR [Access_Count]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Num_Da__2F9A1060]  DEFAULT ((0)) FOR [Num_Days]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Prep_D__308E3499]  DEFAULT ((0)) FOR [Prep_Days]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Recur__318258D2]  DEFAULT ((0)) FOR [Recur]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Recur___32767D0B]  DEFAULT ((0)) FOR [Recur_Product_ID]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__VertOp__336AA144]  DEFAULT ((0)) FOR [VertOptions]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__GiftWr__345EC57D]  DEFAULT ((0)) FOR [GiftWrap]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Freigh__3552E9B6]  DEFAULT ((0)) FOR [Freight_Dom]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Freigh__36470DEF]  DEFAULT ((0)) FOR [Freight_Intl]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Pack_W__373B3228]  DEFAULT ((0)) FOR [Pack_Width]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Pack_H__382F5661]  DEFAULT ((0)) FOR [Pack_Height]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Pack_L__39237A9A]  DEFAULT ((0)) FOR [Pack_Length]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__User_I__3A179ED3]  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Hide_i__3B0BC30C]  DEFAULT ((0)) FOR [Hide_in_cart]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Low_Op__3BFFE745]  DEFAULT ((0)) FOR [Low_Opt_Price]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Sell_o__3CF40B7E]  DEFAULT ((1)) FOR [Sell_on_Amazon]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Hide_i__3DE82FB7]  DEFAULT ((0)) FOR [Hide_in_admin]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__AllowD__3EDC53F0]  DEFAULT ((0)) FOR [AllowDropShip]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__LsItem__3FD07829]  DEFAULT ((0)) FOR [LsItemMatrixId]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__NobuyM__04DA9AE4]  DEFAULT ((0)) FOR [NobuyMessage]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__AddCra__05CEBF1D]  DEFAULT ((0)) FOR [AddCrate]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__QuickC__06C2E356]  DEFAULT ((0)) FOR [QuickCheckoutOnly]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__ShowBu__07B7078F]  DEFAULT ((0)) FOR [ShowBuyMessage]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Highli__08AB2BC8]  DEFAULT ((0)) FOR [Highlight2]
GO
ALTER TABLE [dbo].[Products] ADD  CONSTRAINT [DF__Products__Add_Ad__5C979F60]  DEFAULT ((0)) FOR [Add_Additional_Handling]
GO
ALTER TABLE [dbo].[Promotions] ADD  DEFAULT ((1)) FOR [Type1]
GO
ALTER TABLE [dbo].[Promotions] ADD  DEFAULT ((1)) FOR [Type2]
GO
ALTER TABLE [dbo].[Promotions] ADD  DEFAULT ((0)) FOR [Type3]
GO
ALTER TABLE [dbo].[Promotions] ADD  DEFAULT ((0)) FOR [Type4]
GO
ALTER TABLE [dbo].[Promotions] ADD  DEFAULT ((0)) FOR [OneTime]
GO
ALTER TABLE [dbo].[Promotions] ADD  DEFAULT ((0)) FOR [Amount]
GO
ALTER TABLE [dbo].[Promotions] ADD  DEFAULT ((0)) FOR [QualifyNum]
GO
ALTER TABLE [dbo].[Promotions] ADD  DEFAULT ((0)) FOR [QualifyNumMax]
GO
ALTER TABLE [dbo].[Promotions] ADD  DEFAULT ((0)) FOR [DiscountNum]
GO
ALTER TABLE [dbo].[Promotions] ADD  DEFAULT ((0)) FOR [Multiply]
GO
ALTER TABLE [dbo].[Promotions] ADD  DEFAULT ((0)) FOR [Disc_Product]
GO
ALTER TABLE [dbo].[Promotions] ADD  DEFAULT ((0)) FOR [Add_DiscProd]
GO
ALTER TABLE [dbo].[Promotions] ADD  DEFAULT ((0)) FOR [AccessKey]
GO
ALTER TABLE [dbo].[QB_Settings] ADD  DEFAULT ('https://www.nucomwebhosting.com') FOR [NucomServicesURL]
GO
ALTER TABLE [dbo].[QuickCheckout_settings] ADD  CONSTRAINT [DF_QuickCheckout_settings_Display]  DEFAULT ((1)) FOR [Display]
GO
ALTER TABLE [dbo].[QuickCheckout_settings] ADD  CONSTRAINT [DF_QuickCheckout_settings_payinvoiceProduct_id]  DEFAULT ((0)) FOR [payinvoiceProduct_id]
GO
ALTER TABLE [dbo].[QuickCheckout_settings] ADD  CONSTRAINT [DF_QuickCheckout_settings_PayInvoiceAddon1]  DEFAULT ((0)) FOR [PayInvoiceAddon1]
GO
ALTER TABLE [dbo].[QuickCheckout_settings] ADD  CONSTRAINT [DF_QuickCheckout_settings_PayInvoiceAddon2]  DEFAULT ((0)) FOR [PayInvoiceAddon2]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT ('0') FOR [User_ID]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [SiteName]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [OriginURL]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [OriginTitle]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [ToEmail]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [ToEmailCC]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [ToEmailBCC]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [ToSubject]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [Attachment]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [FromIP]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [FromName]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [FromEmail]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [FromFFields]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [FromMessage]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [MsgRead]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [Status]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [Notes]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (getdate()) FOR [Created]
GO
ALTER TABLE [dbo].[responses] ADD  DEFAULT (NULL) FOR [Updated]
GO
ALTER TABLE [dbo].[Search_terms] ADD  DEFAULT ((0)) FOR [Search_category]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__TimeOf__2AF556D4]  DEFAULT ((0)) FOR [TimeOffset]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__UseInv__2BE97B0D]  DEFAULT ((0)) FOR [UseInvTab]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__ShowIn__2CDD9F46]  DEFAULT ((0)) FOR [ShowInStock]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__OutofS__2DD1C37F]  DEFAULT ((1)) FOR [OutofStock]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__ShowRe__2EC5E7B8]  DEFAULT ((1)) FOR [ShowRetail]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Wishli__2FBA0BF1]  DEFAULT ((0)) FOR [Wishlists]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__CColum__30AE302A]  DEFAULT ((0)) FOR [CColumns]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__PColum__31A25463]  DEFAULT ((0)) FOR [PColumns]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__MaxPro__3296789C]  DEFAULT ((9999)) FOR [MaxProds]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__ProdRo__338A9CD5]  DEFAULT ((0)) FOR [ProdRoot]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Cached__347EC10E]  DEFAULT ((0)) FOR [CachedProds]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Featur__3572E547]  DEFAULT ((0)) FOR [FeatureRoot]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__MaxFea__36670980]  DEFAULT ((0)) FOR [MaxFeatures]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Produc__375B2DB9]  DEFAULT ((2)) FOR [Product_show_shortDesc]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Produc__384F51F2]  DEFAULT ((2)) FOR [Product_show_orderBox]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Produc__3943762B]  DEFAULT ((2)) FOR [Product_show_Ratings]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Produc__3A379A64]  DEFAULT ((2)) FOR [Product_show_Icons]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Produc__3B2BBE9D]  DEFAULT ((2)) FOR [Product_show_details]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Produc__3C1FE2D6]  DEFAULT ((2)) FOR [Product_show_SKU]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Produc__3D14070F]  DEFAULT ((1)) FOR [Product_show_customFields]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__ShowPr__3E082B48]  DEFAULT ((0)) FOR [ShowProductSubscriptions]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__ShowSe__3EFC4F81]  DEFAULT ((0)) FOR [ShowSearchCategories]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Catego__3FF073BA]  DEFAULT ('200') FOR [Category_sm_image_width]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Catego__40E497F3]  DEFAULT ('200') FOR [Category_sm_image_height]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Catego__41D8BC2C]  DEFAULT ('400') FOR [Category_lg_image_width]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Catego__42CCE065]  DEFAULT ('400') FOR [Category_lg_image_height]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Image___43C1049E]  DEFAULT ('85') FOR [Image_Quality]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Use_Im__44B528D7]  DEFAULT ((0)) FOR [Use_ImageMagick]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Catego__45A94D10]  DEFAULT ((0)) FOR [Category_image_height]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Color___469D7149]  DEFAULT ((0)) FOR [Color_ID]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Email___47919582]  DEFAULT ((0)) FOR [Email_Port]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Email___4885B9BB]  DEFAULT ((0)) FOR [Email_useSSL]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Email___4979DDF4]  DEFAULT ((0)) FOR [Email_useTLS]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Admin___4A6E022D]  DEFAULT ((0)) FOR [Admin_New_Window]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__GiftRe__4B622666]  DEFAULT ((0)) FOR [GiftRegistry]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__DoNotD__4C564A9F]  DEFAULT ((0)) FOR [DoNotDspProdsInOffCats]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__DoNotD__4D4A6ED8]  DEFAULT ((0)) FOR [DoNotDspFeaturesInOffCats]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__OnePag__4E3E9311]  DEFAULT ((0)) FOR [OnePageCheckout]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__UseSES__4F32B74A]  DEFAULT ((0)) FOR [UseSES]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__EditPe__5026DB83]  DEFAULT ((1)) FOR [EditPermalink]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__UseSES__511AFFBC]  DEFAULT ((0)) FOR [UseSESDummyExtension]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__SESDum__520F23F5]  DEFAULT ('htm') FOR [SESDummyExtension]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__UseAut__5303482E]  DEFAULT ((1)) FOR [UseAutocomplete]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__AllowW__53F76C67]  DEFAULT ((0)) FOR [AllowWholesale]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__UseVer__54EB90A0]  DEFAULT ((0)) FOR [UseVerity]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Use_Ma__55DFB4D9]  DEFAULT ((0)) FOR [Use_Mailinglist]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__ShowSo__56D3D912]  DEFAULT ((0)) FOR [ShowSource]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__ShowDr__57C7FD4B]  DEFAULT ((0)) FOR [ShowDropShip]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Show_A__58BC2184]  DEFAULT ((0)) FOR [Show_Amazon]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Produc__59B045BD]  DEFAULT ((0)) FOR [ProductReviews]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Produc__5AA469F6]  DEFAULT ((0)) FOR [ProductReview_Approve]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Produc__5B988E2F]  DEFAULT ((0)) FOR [ProductReview_Flag]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Produc__5C8CB268]  DEFAULT ((1)) FOR [ProductReview_Add]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Produc__5D80D6A1]  DEFAULT ((1)) FOR [ProductReview_Rate]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Produc__5E74FADA]  DEFAULT ((4)) FOR [ProductReviews_Page]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF_Settings_ProductReviews_SendDaysAfter]  DEFAULT ((0)) FOR [ProductReviews_SendDaysAfter]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Featur__5F691F13]  DEFAULT ((0)) FOR [FeatureReviews]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Featur__605D434C]  DEFAULT ((1)) FOR [FeatureReview_Add]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Featur__61516785]  DEFAULT ((0)) FOR [FeatureReview_Flag]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Featur__62458BBE]  DEFAULT ((1)) FOR [FeatureReview_Approve]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__BlogRe__6339AFF7]  DEFAULT ((0)) FOR [BlogReviews]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__BlogRe__642DD430]  DEFAULT ((1)) FOR [BlogReview_Add]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__BlogRe__6521F869]  DEFAULT ((0)) FOR [BlogReview_Flag]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__BlogRe__66161CA2]  DEFAULT ((1)) FOR [BlogReview_Approve]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__th_ima__670A40DB]  DEFAULT ((0)) FOR [th_image_width]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__th_ima__67FE6514]  DEFAULT ((0)) FOR [th_image_height]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__sm_ima__68F2894D]  DEFAULT ((0)) FOR [sm_image_width]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__sm_ima__69E6AD86]  DEFAULT ((0)) FOR [sm_image_height]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__md_ima__6ADAD1BF]  DEFAULT ((0)) FOR [md_image_width]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__md_ima__6BCEF5F8]  DEFAULT ((0)) FOR [md_image_height]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__lg_ima__6CC31A31]  DEFAULT ((0)) FOR [lg_image_width]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__lg_ima__6DB73E6A]  DEFAULT ((0)) FOR [lg_image_height]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Alert___6EAB62A3]  DEFAULT ((0)) FOR [Alert_display]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__LOGIN___6F9F86DC]  DEFAULT ((0)) FOR [LOGIN_SHOWONETIMECODE]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Algoli__7093AB15]  DEFAULT ((0)) FOR [Algolia_ShowInstantSearch]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Algoli__7187CF4E]  DEFAULT ((0)) FOR [Algolia_ShowAutoComplete]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__showca__727BF387]  DEFAULT ((0)) FOR [showcaptcha]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__AC_rec__737017C0]  DEFAULT ((0)) FOR [AC_recur]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__AC_pas__74643BF9]  DEFAULT ((0)) FOR [AC_past]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Homepa__75586032]  DEFAULT ((1)) FOR [Homepage_id]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Footer__764C846B]  DEFAULT ((1)) FOR [Footer_id]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Tax_id__7740A8A4]  DEFAULT ((1)) FOR [Tax_id]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Topcat__7834CCDD]  DEFAULT ((1)) FOR [Topcat_id]
GO
ALTER TABLE [dbo].[Settings] ADD  CONSTRAINT [DF__Settings__Wareho__7928F116]  DEFAULT ((1)) FOR [Warehouse_acct_id]
GO
ALTER TABLE [dbo].[Shipment] ADD  DEFAULT ((0)) FOR [Printed_Pack]
GO
ALTER TABLE [dbo].[Shipping] ADD  DEFAULT ((0)) FOR [MinOrder]
GO
ALTER TABLE [dbo].[Shipping] ADD  DEFAULT ((0)) FOR [MaxOrder]
GO
ALTER TABLE [dbo].[Shipping] ADD  DEFAULT ((0)) FOR [Amount]
GO
ALTER TABLE [dbo].[Shipping] ADD  DEFAULT ((1)) FOR [table_ID]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__ShipB__7C055DC1]  DEFAULT ((0)) FOR [ShipBase]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__InSto__7CF981FA]  DEFAULT ((0)) FOR [InStorePickup]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__Allow__7DEDA633]  DEFAULT ((0)) FOR [AllowNoShip]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__ShipH__7EE1CA6C]  DEFAULT ((0)) FOR [ShipHand]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__Frees__7FD5EEA5]  DEFAULT ((0)) FOR [Freeship_Min]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__FreeS__00CA12DE]  DEFAULT ((0)) FOR [FreeShipAmtFlag]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__FreeS__01BE3717]  DEFAULT ((0)) FOR [FreeShipStateFlag]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__ShowE__02B25B50]  DEFAULT ((0)) FOR [ShowEstimator]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__ShowF__03A67F89]  DEFAULT ((0)) FOR [ShowFreight]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__ShowC__049AA3C2]  DEFAULT ((0)) FOR [ShowCustShipAccount]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__ShowS__058EC7FB]  DEFAULT ((0)) FOR [ShowShipFrom]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__ShowF__0682EC34]  DEFAULT ((1)) FOR [ShowFrontEnd]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__UseDr__0777106D]  DEFAULT ((0)) FOR [UseDropShippers]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__Singl__086B34A6]  DEFAULT ((0)) FOR [SingleShipmentOnly]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__Flatr__095F58DF]  DEFAULT ((0)) FOR [Flatrate]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__Flatr__0A537D18]  DEFAULT ((0)) FOR [Flatrate_min]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF__ShipSetti__Flatr__0B47A151]  DEFAULT ((1)) FOR [Flatrate_domestic]
GO
ALTER TABLE [dbo].[ShipSettings] ADD  CONSTRAINT [DF_ShipSettings_OverrideFreight]  DEFAULT ((0)) FOR [OverrideFreight]
GO
ALTER TABLE [dbo].[short_url] ADD  DEFAULT (NULL) FOR [target_URL]
GO
ALTER TABLE [dbo].[short_url] ADD  DEFAULT (NULL) FOR [short_URL]
GO
ALTER TABLE [dbo].[short_url] ADD  DEFAULT ('0') FOR [click_count]
GO
ALTER TABLE [dbo].[short_url] ADD  DEFAULT (NULL) FOR [date_expire]
GO
ALTER TABLE [dbo].[short_url] ADD  DEFAULT ('0') FOR [target]
GO
ALTER TABLE [dbo].[short_url] ADD  DEFAULT ('0') FOR [category]
GO
ALTER TABLE [dbo].[short_url_category] ADD  DEFAULT (NULL) FOR [Name]
GO
ALTER TABLE [dbo].[Social_Media_Icons] ADD  DEFAULT ((1)) FOR [SettingID]
GO
ALTER TABLE [dbo].[Social_Media_Icons] ADD  DEFAULT (NULL) FOR [Name]
GO
ALTER TABLE [dbo].[Social_Media_Icons] ADD  DEFAULT (NULL) FOR [Link]
GO
ALTER TABLE [dbo].[Social_Media_Icons] ADD  DEFAULT (NULL) FOR [Image]
GO
ALTER TABLE [dbo].[Social_Media_Icons] ADD  DEFAULT (NULL) FOR [Color]
GO
ALTER TABLE [dbo].[Social_Media_Icons] ADD  DEFAULT (NULL) FOR [ColorAlt]
GO
ALTER TABLE [dbo].[Social_Media_Icons] ADD  DEFAULT (NULL) FOR [Class]
GO
ALTER TABLE [dbo].[Social_Media_Icons] ADD  DEFAULT (NULL) FOR [Icon]
GO
ALTER TABLE [dbo].[Social_Media_Icons] ADD  DEFAULT ((9999)) FOR [Priority]
GO
ALTER TABLE [dbo].[Social_Media_Icons] ADD  DEFAULT ((0)) FOR [Display]
GO
ALTER TABLE [dbo].[States] ADD  DEFAULT ((1)) FOR [Display]
GO
ALTER TABLE [dbo].[StateTax] ADD  DEFAULT ((0)) FOR [Code_ID]
GO
ALTER TABLE [dbo].[StateTax] ADD  DEFAULT ((0)) FOR [TaxRate]
GO
ALTER TABLE [dbo].[StateTax] ADD  DEFAULT ((0)) FOR [TaxShip]
GO
ALTER TABLE [dbo].[StdAddons] ADD  DEFAULT ((0)) FOR [Std_Display]
GO
ALTER TABLE [dbo].[StdAddons] ADD  DEFAULT ((0)) FOR [Std_Price]
GO
ALTER TABLE [dbo].[StdAddons] ADD  DEFAULT ((0)) FOR [Std_Price_Wholesale]
GO
ALTER TABLE [dbo].[StdAddons] ADD  DEFAULT ((0)) FOR [Std_Weight]
GO
ALTER TABLE [dbo].[StdAddons] ADD  DEFAULT ((0)) FOR [Std_ProdMult]
GO
ALTER TABLE [dbo].[StdAddons] ADD  DEFAULT ((0)) FOR [Std_Required]
GO
ALTER TABLE [dbo].[StdAddons] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[StdOpt_Choices] ADD  DEFAULT ((0)) FOR [Price]
GO
ALTER TABLE [dbo].[StdOpt_Choices] ADD  DEFAULT ((0)) FOR [Price_Wholesale]
GO
ALTER TABLE [dbo].[StdOpt_Choices] ADD  DEFAULT ((0)) FOR [Weight]
GO
ALTER TABLE [dbo].[StdOpt_Choices] ADD  DEFAULT ((0)) FOR [Display]
GO
ALTER TABLE [dbo].[StdOpt_Choices] ADD  DEFAULT ((0)) FOR [SortOrder]
GO
ALTER TABLE [dbo].[StdOptions] ADD  DEFAULT ((0)) FOR [Std_Display]
GO
ALTER TABLE [dbo].[StdOptions] ADD  DEFAULT ((1)) FOR [Std_ColorDisplay]
GO
ALTER TABLE [dbo].[StdOptions] ADD  DEFAULT ((0)) FOR [Std_Required]
GO
ALTER TABLE [dbo].[StdOptions] ADD  DEFAULT ((0)) FOR [Std_UseOptImageIncart]
GO
ALTER TABLE [dbo].[StdOptions] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[Subscription_Order_Items] ADD  DEFAULT ((0)) FOR [AddonMultP]
GO
ALTER TABLE [dbo].[Subscription_Order_Items] ADD  DEFAULT ((0)) FOR [AddonNonMultP]
GO
ALTER TABLE [dbo].[Subscription_Order_Items] ADD  DEFAULT ((0)) FOR [Original_Price]
GO
ALTER TABLE [dbo].[Subscription_Order_Items] ADD  DEFAULT ((0)) FOR [Quantity]
GO
ALTER TABLE [dbo].[Subscription_Order_Items] ADD  DEFAULT ((0)) FOR [OptPrice]
GO
ALTER TABLE [dbo].[Subscription_Order_Items] ADD  DEFAULT ((0)) FOR [OptQuant]
GO
ALTER TABLE [dbo].[Subscription_Order_Items] ADD  DEFAULT ((1)) FOR [Subscription_period]
GO
ALTER TABLE [dbo].[Subscription_Order_Items] ADD  DEFAULT ((0)) FOR [Per_Item_Weight]
GO
ALTER TABLE [dbo].[Subscription_Order_Items] ADD  DEFAULT ((0)) FOR [Pause]
GO
ALTER TABLE [dbo].[Subscription_Settings] ADD  DEFAULT ((1)) FOR [ID]
GO
ALTER TABLE [dbo].[Subscription_Settings] ADD  DEFAULT ((0)) FOR [FreeShipping]
GO
ALTER TABLE [dbo].[Subscription_Settings] ADD  DEFAULT ((0)) FOR [FlatRate]
GO
ALTER TABLE [dbo].[Subscription_Settings] ADD  DEFAULT ((0)) FOR [ShippingMethod_id]
GO
ALTER TABLE [dbo].[SystemText] ADD  DEFAULT ((1)) FOR [Display]
GO
ALTER TABLE [dbo].[TaxCodes] ADD  DEFAULT ((0)) FOR [CalcOrder]
GO
ALTER TABLE [dbo].[TaxCodes] ADD  DEFAULT ((0)) FOR [Cumulative]
GO
ALTER TABLE [dbo].[TaxCodes] ADD  DEFAULT ((0)) FOR [TaxAll]
GO
ALTER TABLE [dbo].[TaxCodes] ADD  DEFAULT ((0)) FOR [TaxRate]
GO
ALTER TABLE [dbo].[TaxCodes] ADD  DEFAULT ((0)) FOR [TaxShipping]
GO
ALTER TABLE [dbo].[TaxCodes] ADD  DEFAULT ((0)) FOR [ShowonProds]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Addon__50E5F592]  DEFAULT ((0)) FOR [AddonMultP]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Addon__51DA19CB]  DEFAULT ((0)) FOR [AddonNonMultP]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Addon__52CE3E04]  DEFAULT ((0)) FOR [AddonMultW]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Addon__53C2623D]  DEFAULT ((0)) FOR [AddonNonMultW]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__OptPr__54B68676]  DEFAULT ((0)) FOR [OptPrice]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__OptWe__55AAAAAF]  DEFAULT ((0)) FOR [OptWeight]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Price__569ECEE8]  DEFAULT ((0)) FOR [Price]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Weigh__5792F321]  DEFAULT ((0)) FOR [Weight]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Quant__5887175A]  DEFAULT ((0)) FOR [Quantity]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__OptQu__597B3B93]  DEFAULT ((0)) FOR [OptQuant]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__OptCh__5A6F5FCC]  DEFAULT ((0)) FOR [OptChoice]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__GiftI__5B638405]  DEFAULT ((0)) FOR [GiftItem_ID]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Disco__5C57A83E]  DEFAULT ((0)) FOR [Discount]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__DiscA__5D4BCC77]  DEFAULT ((0)) FOR [DiscAmount]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Quant__5E3FF0B0]  DEFAULT ((0)) FOR [QuantDisc]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Promo__5F3414E9]  DEFAULT ((0)) FOR [Promotion]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Promo__60283922]  DEFAULT ((0)) FOR [PromoAmount]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Promo__611C5D5B]  DEFAULT ((0)) FOR [PromoQuant]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Recal__62108194]  DEFAULT ((0)) FOR [Recalcquantity]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Overr__6304A5CD]  DEFAULT ((0)) FOR [Override]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Hide___63F8CA06]  DEFAULT ((0)) FOR [Hide_in_Cart]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Subsc__64ECEE3F]  DEFAULT ((0)) FOR [Subscription]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Subsc__65E11278]  DEFAULT ((0)) FOR [Subscription_discount]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Subsc__66D536B1]  DEFAULT ((0)) FOR [Subscription_period]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Packa__67C95AEA]  DEFAULT ((0)) FOR [PackageParent]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF__TempBaske__Categ__68BD7F23]  DEFAULT ((0)) FOR [Category_id]
GO
ALTER TABLE [dbo].[TempBasket] ADD  CONSTRAINT [DF_TempBasket_Gift]  DEFAULT ((0)) FOR [Gift]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [AddonMultP]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [AddonNonMultP]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [AddonMultW]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [AddonNonMultW]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [OptPrice]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [OptWeight]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [Price]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [Weight]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [Quantity]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [OptQuant]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [OptChoice]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [GiftItem_ID]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [Discount]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [DiscAmount]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [QuantDisc]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [Promotion]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [PromoAmount]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [PromoQuant]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [Recalcquantity]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [Override]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [Subscription]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [Subscription_discount]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [Subscription_period]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [PackageParent]
GO
ALTER TABLE [dbo].[TempBasket_SFL] ADD  DEFAULT ((0)) FOR [Category_id]
GO
ALTER TABLE [dbo].[TempCustomer] ADD  DEFAULT ((0)) FOR [ShipToYes]
GO
ALTER TABLE [dbo].[TempCustomer] ADD  DEFAULT ((0)) FOR [Residence]
GO
ALTER TABLE [dbo].[TempCustomer] ADD  DEFAULT ('cart') FOR [Step]
GO
ALTER TABLE [dbo].[TempCustomer] ADD  DEFAULT ((0)) FOR [Abandoned]
GO
ALTER TABLE [dbo].[TempCustomer] ADD  DEFAULT ((0)) FOR [Contacted_by_Phone]
GO
ALTER TABLE [dbo].[TempOrder] ADD  DEFAULT ((0)) FOR [OrderTotal]
GO
ALTER TABLE [dbo].[TempOrder] ADD  DEFAULT ((0)) FOR [Tax]
GO
ALTER TABLE [dbo].[TempOrder] ADD  DEFAULT ((0)) FOR [Shipping]
GO
ALTER TABLE [dbo].[TempOrder] ADD  DEFAULT ((0)) FOR [Freight]
GO
ALTER TABLE [dbo].[TempOrder] ADD  DEFAULT ((0)) FOR [OrderDisc]
GO
ALTER TABLE [dbo].[TempOrder] ADD  DEFAULT ((0)) FOR [Credits]
GO
ALTER TABLE [dbo].[TempOrder] ADD  DEFAULT ((0)) FOR [AddonTotal]
GO
ALTER TABLE [dbo].[TempOrder] ADD  DEFAULT ((0)) FOR [Affiliate]
GO
ALTER TABLE [dbo].[TempOrder] ADD  DEFAULT ((0)) FOR [SettingID]
GO
ALTER TABLE [dbo].[TempOrder] ADD  DEFAULT ((0)) FOR [Subscribe_SMS_shipping]
GO
ALTER TABLE [dbo].[TempOrder] ADD  DEFAULT ((0)) FOR [Subscribe_SMS_promo]
GO
ALTER TABLE [dbo].[TempShipTo] ADD  DEFAULT ((0)) FOR [Residence]
GO
ALTER TABLE [dbo].[twilio_settings] ADD  DEFAULT ((1)) FOR [twilio_id]
GO
ALTER TABLE [dbo].[twilio_settings] ADD  DEFAULT (NULL) FOR [PhoneNumber]
GO
ALTER TABLE [dbo].[twilio_settings] ADD  DEFAULT (NULL) FOR [Account_SID]
GO
ALTER TABLE [dbo].[twilio_settings] ADD  DEFAULT (NULL) FOR [Auth_token]
GO
ALTER TABLE [dbo].[twilio_settings] ADD  DEFAULT ((0)) FOR [Subscribe_SMS_shipping]
GO
ALTER TABLE [dbo].[twilio_settings] ADD  DEFAULT ((0)) FOR [Subscribe_SMS_promo]
GO
ALTER TABLE [dbo].[twilio_settings] ADD  DEFAULT ((0)) FOR [Subscribe_SMS_confirmation]
GO
ALTER TABLE [dbo].[twilio_settings] ADD  DEFAULT ('https://www.nucomwebhosting.com') FOR [NucomServicesURL]
GO
ALTER TABLE [dbo].[UPS_Origins] ADD  DEFAULT ((0)) FOR [OrderBy]
GO
ALTER TABLE [dbo].[UPS_Settings] ADD  DEFAULT ((0)) FOR [ResRates]
GO
ALTER TABLE [dbo].[UPS_Settings] ADD  DEFAULT ((0)) FOR [MaxWeight]
GO
ALTER TABLE [dbo].[UPS_Settings] ADD  DEFAULT ((0)) FOR [Debug]
GO
ALTER TABLE [dbo].[UPS_Settings] ADD  DEFAULT ((0)) FOR [UseAV]
GO
ALTER TABLE [dbo].[UPS_Settings] ADD  DEFAULT ((0)) FOR [Logging]
GO
ALTER TABLE [dbo].[UPS_Settings] ADD  DEFAULT ((0)) FOR [ShowNegotiatedRates]
GO
ALTER TABLE [dbo].[UPSMethods] ADD  DEFAULT ((0)) FOR [Used]
GO
ALTER TABLE [dbo].[UPSMethods] ADD  DEFAULT ((0)) FOR [Priority]
GO
ALTER TABLE [dbo].[UPSMethods] ADD  DEFAULT ((0)) FOR [MethodHand]
GO
ALTER TABLE [dbo].[UPSMethods] ADD  DEFAULT ((0)) FOR [MethodWeight]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [EmailIsBad]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [Subscribe]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [Subscribe_SMS_shipping]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [Subscribe_SMS_promo]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [Customer_ID]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [ShipTo]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [Group_ID]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [Account_ID]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [SettingID]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [Affiliate_ID]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [CardisValid]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [CurrentBalance]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [Disable]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [TaxExempt]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [Allow_PO]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [LoginsTotal]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [LoginsDay]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((0)) FOR [FailedLogins]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [UseRememberMe]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((1)) FOR [EmailAsName]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((1)) FOR [UseStateList]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((1)) FOR [UseStateBox]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [RequireCounty]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((1)) FOR [UseCountryList]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [UseResidential]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [UseTaxID]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [UseCustomerShipping]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [UseGroupCode]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [UseBirthdate]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [UseTerms]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [UseCCard]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [UseEmailConf]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [UseEmailNotif]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [MemberNotify]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((1)) FOR [UseShipTo]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [UseAccounts]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((1)) FOR [ShowAccount]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((1)) FOR [ShowDirectory]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((1)) FOR [ShowSubscribe]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((1)) FOR [SubscribeCustomer]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((1)) FOR [StrictLogins]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [MaxDailyLogins]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((5)) FOR [MaxFailures]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [AllowAffs]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [AffPercent]
GO
ALTER TABLE [dbo].[UserSettings] ADD  DEFAULT ((0)) FOR [AllowWholesale]
GO
ALTER TABLE [dbo].[USPS_Settings] ADD  DEFAULT ((50)) FOR [MaxWeight]
GO
ALTER TABLE [dbo].[USPS_Settings] ADD  DEFAULT ((0)) FOR [Logging]
GO
ALTER TABLE [dbo].[USPS_Settings] ADD  DEFAULT ((0)) FOR [Debug]
GO
ALTER TABLE [dbo].[USPS_Settings] ADD  DEFAULT ((0)) FOR [UseAV]
GO
ALTER TABLE [dbo].[USPSMethods] ADD  DEFAULT ((0)) FOR [Used]
GO
ALTER TABLE [dbo].[USPSMethods] ADD  DEFAULT ((0)) FOR [MethodHand]
GO
ALTER TABLE [dbo].[USPSMethods] ADD  DEFAULT ((0)) FOR [MethodWeight]
GO
ALTER TABLE [dbo].[USPSMethods] ADD  DEFAULT ((0)) FOR [Priority]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [User_ID]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((1)) FOR [ListNum]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [ItemNum]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [Product_ID]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [AddonMultP]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [AddonNonMultP]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [AddonMultW]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [AddonNonMultW]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [OptPrice]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [OptWeight]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [OptQuant]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [OptChoice]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [Price]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [Weight]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [Quantity_Requested]
GO
ALTER TABLE [dbo].[WishList] ADD  DEFAULT ((0)) FOR [Quantity_Purchased]
GO
