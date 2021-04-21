using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace SoftthaiWeb.Models.DB
{
    public partial class SoftthaiWebContext : DbContext
    {
        public SoftthaiWebContext()
        {
        }

        public SoftthaiWebContext(DbContextOptions<SoftthaiWebContext> options)
            : base(options)
        {
        }

        public virtual DbSet<TM_Config> TM_Config { get; set; }
        public virtual DbSet<TM_EmailTemplate> TM_EmailTemplate { get; set; }
        public virtual DbSet<T_AdminGroup> T_AdminGroup { get; set; }
        public virtual DbSet<T_AdminGroup_Permission> T_AdminGroup_Permission { get; set; }
        public virtual DbSet<T_AdminMenu> T_AdminMenu { get; set; }
        public virtual DbSet<T_AdminUser> T_AdminUser { get; set; }
        public virtual DbSet<T_ContactInfo> T_ContactInfo { get; set; }
        public virtual DbSet<T_Customer> T_Customer { get; set; }
        public virtual DbSet<T_CustomerRequest> T_CustomerRequest { get; set; }
        public virtual DbSet<T_CustomerRequest_File> T_CustomerRequest_File { get; set; }
        public virtual DbSet<T_Customer_Pin> T_Customer_Pin { get; set; }
        public virtual DbSet<T_Log_Email> T_Log_Email { get; set; }
        public virtual DbSet<T_MainMenu> T_MainMenu { get; set; }
        public virtual DbSet<T_MainMenu_Panel> T_MainMenu_Panel { get; set; }
        public virtual DbSet<T_MainMenu_Panel_File> T_MainMenu_Panel_File { get; set; }
        public virtual DbSet<T_MainMenu_Panel_Label> T_MainMenu_Panel_Label { get; set; }
        public virtual DbSet<T_MasterData> T_MasterData { get; set; }
        public virtual DbSet<T_MasterType> T_MasterType { get; set; }
        public virtual DbSet<T_News> T_News { get; set; }
        public virtual DbSet<T_News_File> T_News_File { get; set; }
        public virtual DbSet<T_News_Pin> T_News_Pin { get; set; }
        public virtual DbSet<T_Project> T_Project { get; set; }
        public virtual DbSet<T_ProjectType> T_ProjectType { get; set; }
        public virtual DbSet<T_Project_Pin> T_Project_Pin { get; set; }
        public virtual DbSet<T_SupportType> T_SupportType { get; set; }
        public virtual DbSet<V_Project_PIN> V_Project_PIN { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=103.129.15.138;User ID=softthai; database=SoftthaiWeb;Password=cSoftth@1;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "Thai_CI_AS");

            modelBuilder.Entity<TM_Config>(entity =>
            {
                entity.HasKey(e => e.nConfig_ID);

                entity.Property(e => e.nConfig_ID).ValueGeneratedNever();

                entity.Property(e => e.IsConfig_Bit).HasComment("ข้อมูลที่ต้องการ Config สำหรับข้อมูลที่เป็นประเภท Bit");

                entity.Property(e => e.dConfig_Datetime)
                    .HasColumnType("datetime")
                    .HasComment("ข้อมูลที่ต้องการ Config สำหรับข้อมูลที่เป็นประเภท Datetime");

                entity.Property(e => e.nConfig_Int).HasComment("ข้อมูลที่ต้องการ Config สำหรับข้อมูลที่เป็นประเภท Int");

                entity.Property(e => e.sConfig_Description)
                    .IsUnicode(false)
                    .HasComment("คำอธิบายของ Config");

                entity.Property(e => e.sConfig_Name)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasComment("ชื่อ ของ Config");

                entity.Property(e => e.sConfig_Varchar)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasComment("ข้อมูลที่ต้องการ Config สำหรับข้อมูลที่เป็นประเภท Varchar");
            });

            modelBuilder.Entity<TM_EmailTemplate>(entity =>
            {
                entity.HasKey(e => e.nEmailTemplateID);

                entity.Property(e => e.nEmailTemplateID).ValueGeneratedNever();

                entity.Property(e => e.dUpdate)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.sContent).IsUnicode(false);

                entity.Property(e => e.sEmailTemplate_Description).IsUnicode(false);

                entity.Property(e => e.sSubject).IsUnicode(false);

                entity.Property(e => e.sUpdateBy)
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_AdminGroup>(entity =>
            {
                entity.HasKey(e => e.nID);

                entity.Property(e => e.nID).ValueGeneratedNever();

                entity.Property(e => e.dCreate).HasColumnType("datetime");

                entity.Property(e => e.dDelete).HasColumnType("datetime");

                entity.Property(e => e.dUpdate).HasColumnType("datetime");

                entity.Property(e => e.sName)
                    .HasMaxLength(200)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_AdminGroup_Permission>(entity =>
            {
                entity.HasKey(e => new { e.nID_UserGroup, e.nID_Menu });
            });

            modelBuilder.Entity<T_AdminMenu>(entity =>
            {
                entity.HasKey(e => e.nID);

                entity.Property(e => e.nID).ValueGeneratedNever();

                entity.Property(e => e.sIcon)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.sName)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.sURL)
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_AdminUser>(entity =>
            {
                entity.HasKey(e => e.nID);

                entity.Property(e => e.nID).ValueGeneratedNever();

                entity.Property(e => e.dCreate).HasColumnType("datetime");

                entity.Property(e => e.dDelete).HasColumnType("datetime");

                entity.Property(e => e.dUpdate).HasColumnType("datetime");

                entity.Property(e => e.sEmail)
                    .HasMaxLength(254)
                    .IsUnicode(false);

                entity.Property(e => e.sName)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.sPassword)
                    .IsRequired()
                    .HasMaxLength(32)
                    .IsUnicode(false);

                entity.Property(e => e.sUsername)
                    .IsRequired()
                    .HasMaxLength(254)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_ContactInfo>(entity =>
            {
                entity.HasKey(e => e.nID);

                entity.Property(e => e.nID).ValueGeneratedNever();

                entity.Property(e => e.dUpdate).HasColumnType("datetime");

                entity.Property(e => e.sLabel)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.sText)
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_Customer>(entity =>
            {
                entity.HasKey(e => e.nID);

                entity.Property(e => e.dCreate).HasColumnType("datetime");

                entity.Property(e => e.dDelete).HasColumnType("datetime");

                entity.Property(e => e.dUpdate).HasColumnType("datetime");

                entity.Property(e => e.sFileName)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFilePath)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFileSize)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sSystemFileName)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sTitle)
                    .HasMaxLength(250)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_CustomerRequest>(entity =>
            {
                entity.HasKey(e => e.nID);

                entity.Property(e => e.nID).ValueGeneratedNever();

                entity.Property(e => e.dReply).HasColumnType("datetime");

                entity.Property(e => e.dRequest).HasColumnType("datetime");

                entity.Property(e => e.sChannelOther)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.sDescription)
                    .HasMaxLength(5000)
                    .IsUnicode(false);

                entity.Property(e => e.sEmail)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.sMobile)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.sReply).IsUnicode(false);

                entity.Property(e => e.sReplyType)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.sRequester)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.sTopic)
                    .HasMaxLength(300)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_CustomerRequest_File>(entity =>
            {
                entity.HasKey(e => new { e.nID, e.nFileID });

                entity.Property(e => e.sFileName_Origin)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFileName_System)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFolderPath)
                    .HasMaxLength(250)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_Customer_Pin>(entity =>
            {
                entity.HasKey(e => e.nID);

                entity.Property(e => e.nID).ValueGeneratedNever();

                entity.Property(e => e.dCreate).HasColumnType("datetime");
            });

            modelBuilder.Entity<T_Log_Email>(entity =>
            {
                entity.HasKey(e => e.nLog_Email_ID);

                entity.Property(e => e.dLog_Email_Send).HasColumnType("datetime");

                entity.Property(e => e.sLog_Email_BCC).IsUnicode(false);

                entity.Property(e => e.sLog_Email_CC).IsUnicode(false);

                entity.Property(e => e.sLog_Email_Content).IsUnicode(false);

                entity.Property(e => e.sLog_Email_Debug_CC).IsUnicode(false);

                entity.Property(e => e.sLog_Email_Debug_To).IsUnicode(false);

                entity.Property(e => e.sLog_Email_Subject).IsUnicode(false);

                entity.Property(e => e.sLog_Email_To).IsUnicode(false);
            });

            modelBuilder.Entity<T_MainMenu>(entity =>
            {
                entity.HasKey(e => e.nMainMenuID);

                entity.Property(e => e.nMainMenuID).ValueGeneratedNever();

                entity.Property(e => e.cType)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasComment("ประเภทการแสดงเนื้อหา\r\n- A: ตาม URL ที่กำหนด\r\n- B: กำหนดเนื้อหาเอง");

                entity.Property(e => e.dCreate).HasColumnType("datetime");

                entity.Property(e => e.dDelete).HasColumnType("datetime");

                entity.Property(e => e.dUpdate).HasColumnType("datetime");

                entity.Property(e => e.sHTMLContent).IsUnicode(false);

                entity.Property(e => e.sName)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.sURL)
                    .HasMaxLength(150)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_MainMenu_Panel>(entity =>
            {
                entity.HasKey(e => new { e.nMainMenuID, e.nPanelID });

                entity.Property(e => e.dUpdate).HasColumnType("datetime");

                entity.Property(e => e.sName)
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.sURL_AdjustPage)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_MainMenu_Panel_File>(entity =>
            {
                entity.HasKey(e => new { e.nMainMenuID, e.nPanelID, e.nFileID });

                entity.Property(e => e.sFileName_Origin)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFileName_System)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFolderPath)
                    .HasMaxLength(250)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_MainMenu_Panel_Label>(entity =>
            {
                entity.HasKey(e => new { e.nMainMenuID, e.nPanelID, e.nLabelID });

                entity.Property(e => e.sLabel)
                    .HasMaxLength(1000)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_MasterData>(entity =>
            {
                entity.HasKey(e => e.nID)
                    .HasName("PK_T_Master_data");

                entity.Property(e => e.nID).ValueGeneratedNever();

                entity.Property(e => e.dCreate).HasColumnType("datetime");

                entity.Property(e => e.dDelete).HasColumnType("datetime");

                entity.Property(e => e.dUpdate).HasColumnType("datetime");

                entity.Property(e => e.sName)
                    .HasMaxLength(250)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_MasterType>(entity =>
            {
                entity.HasKey(e => e.nID);

                entity.Property(e => e.nID).ValueGeneratedNever();

                entity.Property(e => e.sName)
                    .HasMaxLength(250)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_News>(entity =>
            {
                entity.HasKey(e => e.nID)
                    .HasName("PK_T_News_1");

                entity.Property(e => e.dCreate).HasColumnType("datetime");

                entity.Property(e => e.dDelete).HasColumnType("datetime");

                entity.Property(e => e.dPost).HasColumnType("datetime");

                entity.Property(e => e.dUpdate).HasColumnType("datetime");

                entity.Property(e => e.sContent).IsUnicode(false);

                entity.Property(e => e.sFileName)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFilePath)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFilePath_Cover)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFileSize)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sSystemFileName)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sTitle)
                    .HasMaxLength(250)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_News_File>(entity =>
            {
                entity.HasKey(e => e.nFileID)
                    .HasName("PK_T_News_File_1");

                entity.Property(e => e.sFileName_Origin)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFileName_System)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFileSize)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFolderPath)
                    .HasMaxLength(250)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_News_Pin>(entity =>
            {
                entity.HasKey(e => e.nID);

                entity.Property(e => e.nID).ValueGeneratedNever();

                entity.Property(e => e.dCreate).HasColumnType("datetime");

                entity.Property(e => e.nOrder).HasComment("เรียงลำดับข่าว");
            });

            modelBuilder.Entity<T_Project>(entity =>
            {
                entity.HasKey(e => e.nID);

                entity.Property(e => e.dCreate).HasColumnType("datetime");

                entity.Property(e => e.dDelete).HasColumnType("datetime");

                entity.Property(e => e.dUpdate).HasColumnType("datetime");

                entity.Property(e => e.sFileName)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFilePath)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFilePath_Cover)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sFileSize)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sSystemFileName)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.sTitle)
                    .HasMaxLength(250)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_ProjectType>(entity =>
            {
                entity.HasKey(e => e.nID);

                entity.Property(e => e.nID).ValueGeneratedNever();

                entity.Property(e => e.dCreate).HasColumnType("datetime");

                entity.Property(e => e.dDelete).HasColumnType("datetime");

                entity.Property(e => e.dUpdate).HasColumnType("datetime");

                entity.Property(e => e.sName)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<T_Project_Pin>(entity =>
            {
                entity.HasKey(e => e.nID);

                entity.Property(e => e.nID).ValueGeneratedNever();

                entity.Property(e => e.dCreate).HasColumnType("datetime");
            });

            modelBuilder.Entity<T_SupportType>(entity =>
            {
                entity.HasKey(e => e.nID);

                entity.Property(e => e.nID).ValueGeneratedNever();

                entity.Property(e => e.dCreate).HasColumnType("datetime");

                entity.Property(e => e.dDelete).HasColumnType("datetime");

                entity.Property(e => e.dUpdate).HasColumnType("datetime");

                entity.Property(e => e.sName)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<V_Project_PIN>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("V_Project_PIN");

                entity.Property(e => e.sTitle)
                    .HasMaxLength(250)
                    .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
