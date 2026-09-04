package com.example.nizam.data.local

import com.example.nizam.data.model.DriveFile
import com.example.nizam.data.model.NizamConstitutionalReportData

object InitialSeedData {
    fun getInitialFiles(): List<DriveFileEntity> {
        val now = System.currentTimeMillis()
        val oneDay = 86_400_000L

        val files = listOf(
            // 1. Root Folders
            DriveFile(
                id = "folder_constitution",
                name = "وثائق ومراجع النظام الدستوري",
                mimeType = DriveFile.MIME_FOLDER,
                parentId = "root",
                modifiedTime = now - (oneDay * 2),
                starred = true
            ),
            DriveFile(
                id = "folder_research",
                name = "أبحاث الفقه والتقنين المعاصر",
                mimeType = DriveFile.MIME_FOLDER,
                parentId = "root",
                modifiedTime = now - (oneDay * 5),
                starred = false
            ),
            DriveFile(
                id = "folder_media",
                name = "الهوية البصرية والرموز المؤسسية",
                mimeType = DriveFile.MIME_FOLDER,
                parentId = "root",
                modifiedTime = now - (oneDay * 12),
                starred = false
            ),

            // 2. Primary Nizam Constitutional Document (Google Doc / Text)
            DriveFile(
                id = "doc_nizam_report",
                name = "تقرير وثيقة النظام الدستوري العربي الإسلامي.gdoc",
                mimeType = DriveFile.MIME_DOCUMENT,
                size = 104_857L,
                parentId = "folder_constitution",
                modifiedTime = now - (oneDay * 1),
                starred = true,
                description = "النسخة المعتمدة الشاملة للأركان والمبادئ والسلطات والمقاصد الشرعية",
                content = NizamConstitutionalReportData.generateMarkdown(),
                webViewLink = "https://docs.google.com/document/d/nizam-constitutional-report/edit"
            ),

            // 3. Historical Charter Document
            DriveFile(
                id = "doc_madinah_charter",
                name = "صحيفة المدينة - النص والتحليل الدستوري.pdf",
                mimeType = DriveFile.MIME_PDF,
                size = 524_288L,
                parentId = "folder_constitution",
                modifiedTime = now - (oneDay * 8),
                starred = true,
                description = "دراسة تحليلية لأول دستور مكتوب في العالم وتطبيقاته في فقه المواطنة",
                content = "صحيفة المدينة المنورة (1 هـ / 622 م):\nتُعد الوثيقة الدستورية الأولى التي أسست لمفهوم المواطنة التعددية، وحرية المعتقد، والدفاع المشترك عن الوطن والمدينة، والتكافل الاجتماعي بين جميع مكونات المجتمع المدني الأول.",
                webViewLink = "https://drive.google.com/file/d/madinah-charter-pdf/view"
            ),

            // 4. Spreadsheets & Presentations
            DriveFile(
                id = "sheet_authorities_matrix",
                name = "مصفوفة مقارنة السلطات الثلاث وقضاء المظالم.gsheet",
                mimeType = DriveFile.MIME_SPREADSHEET,
                size = 48_120L,
                parentId = "folder_research",
                modifiedTime = now - (oneDay * 3),
                starred = false,
                description = "جدول توزيع الاختصاصات والرقابة المتبادلة بين السلطات التشريعية والتنفيذية والقضائية",
                content = "مصفوفة الصلاحيات الدستورية وقضاء المظالم:\n- السلطة التشريعية: تقنين الأحكام والمصلحة المرسلة\n- السلطة التنفيذية: تنفيذ القانون ورعاية شؤون الأمة\n- السلطة القضائية: استقلال القضاء وحماية الحقوق",
                webViewLink = "https://docs.google.com/spreadsheets/d/authorities-matrix/edit"
            ),
            DriveFile(
                id = "slides_symbolism",
                name = "عرض سيميائية الهوية والميزان والكتاب.gslides",
                mimeType = DriveFile.MIME_PRESENTATION,
                size = 2_150_000L,
                parentId = "folder_media",
                modifiedTime = now - (oneDay * 14),
                starred = false,
                description = "عرض تقديمي يشرح دلالات الميزان والقبة والنخلة والكتاب في هوية النظام",
                content = "عرض تقديمي لهوية النظام:\n- الشريحة 1: كفتا الميزان والعدل المطلق\n- الشريحة 2: الكتاب المفتوح ومرجعية الوحي والعلم\n- الشريحة 3: القبة وهيبة السلطة العامة\n- الشريحة 4: النخلة والأصالة العربية",
                webViewLink = "https://docs.google.com/presentation/d/nizam-symbolism/edit"
            ),

            // 5. Shared & Trashed Files
            DriveFile(
                id = "doc_shared_brief",
                name = "الملخص التنفيذي لمقاصد الشريعة الدستورية.docx",
                mimeType = DriveFile.MIME_DOCUMENT,
                size = 35_400L,
                parentId = "root",
                modifiedTime = now - (oneDay * 4),
                shared = true,
                starred = false,
                description = "ملخص الكليات الخمس وتطبيقاتها في صيانة حقوق الإنسان الحديثة",
                content = "الكليات الخمس والمقاصد الضرورية:\n1. حفظ الدين والحرية\n2. حفظ النفس والكرامة\n3. حفظ العقل والتفكير العلمي\n4. حفظ النسل والأسرة\n5. حفظ المال والملكية المشروعة",
                webViewLink = "https://docs.google.com/document/d/shared-brief/edit"
            ),
            DriveFile(
                id = "doc_old_draft",
                name = "مسودة قديمة - غير منقحة.txt",
                mimeType = DriveFile.MIME_TEXT,
                size = 8_200L,
                parentId = "root",
                modifiedTime = now - (oneDay * 30),
                trashed = true,
                description = "مسودة أولية تم استبدالها بالتقرير المعتمد",
                content = "ملاحظات أولية غير معتمدة..."
            )
        )

        return files.map { DriveFileEntity.fromDomain(it) }
    }
}
