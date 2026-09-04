package com.example.nizam.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.CloudQueue
import androidx.compose.material.icons.filled.CreateNewFolder
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.FolderShared
import androidx.compose.material.icons.filled.NoteAdd
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.NavigationDrawerItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nizam.data.model.DriveAbout
import com.example.nizam.data.model.DriveViewSection
import com.example.nizam.ui.theme.Amber400
import com.example.nizam.ui.theme.Emerald400
import com.example.nizam.ui.theme.Emerald500
import com.example.nizam.ui.theme.Emerald950
import com.example.nizam.ui.theme.Rose500
import com.example.nizam.ui.theme.Sky500
import com.example.nizam.ui.theme.Stone400
import com.example.nizam.ui.theme.Stone700
import com.example.nizam.ui.theme.Stone800
import com.example.nizam.ui.theme.Stone850
import com.example.nizam.ui.theme.Stone900
import com.example.nizam.ui.theme.Teal400

@Composable
fun AppSidebar(
    currentSection: DriveViewSection,
    aboutInfo: DriveAbout,
    onSelectSection: (DriveViewSection) -> Unit,
    onNewFolder: () -> Unit,
    onNewDocument: () -> Unit,
    modifier: Modifier = Modifier
) {
    var newMenuExpanded by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .background(Stone900)
            .padding(16.dp)
    ) {
        // App Brand Header
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp)
        ) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(42.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(Emerald500)
            ) {
                Text(
                    text = "ن",
                    color = Color.White,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = "النظام",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = "النظام الدستوري العربي الإسلامي",
                    style = MaterialTheme.typography.labelSmall,
                    color = Emerald400
                )
            }
        }

        // Action Button: "+ جديد"
        Box(modifier = Modifier.fillMaxWidth()) {
            Button(
                onClick = { newMenuExpanded = true },
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Emerald500,
                    contentColor = Color.White
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
                    .testTag("sidebar_new_button")
            ) {
                Icon(imageVector = Icons.Default.Add, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "جديد",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }

            DropdownMenu(
                expanded = newMenuExpanded,
                onDismissRequest = { newMenuExpanded = false },
                modifier = Modifier.background(Stone850)
            ) {
                DropdownMenuItem(
                    text = { Text("مجلد جديد", color = Color.White) },
                    leadingIcon = {
                        Icon(Icons.Default.CreateNewFolder, contentDescription = null, tint = Emerald400)
                    },
                    onClick = {
                        newMenuExpanded = false
                        onNewFolder()
                    },
                    modifier = Modifier.testTag("menu_new_folder")
                )
                DropdownMenuItem(
                    text = { Text("مستند جديد", color = Color.White) },
                    leadingIcon = {
                        Icon(Icons.Default.NoteAdd, contentDescription = null, tint = Sky500)
                    },
                    onClick = {
                        newMenuExpanded = false
                        onNewDocument()
                    },
                    modifier = Modifier.testTag("menu_new_document")
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Navigation Items
        SidebarItem(
            label = "ملفاتي (My Drive)",
            icon = Icons.Default.CloudQueue,
            selected = currentSection == DriveViewSection.MY_DRIVE,
            iconTint = Emerald400,
            onClick = { onSelectSection(DriveViewSection.MY_DRIVE) },
            testTag = "sidebar_my_drive"
        )

        SidebarItem(
            label = "المشتركة معي",
            icon = Icons.Default.FolderShared,
            selected = currentSection == DriveViewSection.SHARED_WITH_ME,
            iconTint = Sky500,
            onClick = { onSelectSection(DriveViewSection.SHARED_WITH_ME) },
            testTag = "sidebar_shared"
        )

        SidebarItem(
            label = "المميزة بنجمة",
            icon = Icons.Default.Star,
            selected = currentSection == DriveViewSection.STARRED,
            iconTint = Amber400,
            onClick = { onSelectSection(DriveViewSection.STARRED) },
            testTag = "sidebar_starred"
        )

        SidebarItem(
            label = "سلة المهملات",
            icon = Icons.Default.Delete,
            selected = currentSection == DriveViewSection.TRASH,
            iconTint = Rose500,
            onClick = { onSelectSection(DriveViewSection.TRASH) },
            testTag = "sidebar_trash"
        )

        Divider(
            color = Stone800,
            thickness = 1.dp,
            modifier = Modifier.padding(vertical = 12.dp)
        )

        // Nizam Constitutional Report Tab
        SidebarItem(
            label = "وثيقة النظام الدستوري",
            icon = Icons.Default.Book,
            selected = currentSection == DriveViewSection.NIZAM_REPORT,
            iconTint = Teal400,
            badge = "معتمد",
            onClick = { onSelectSection(DriveViewSection.NIZAM_REPORT) },
            testTag = "sidebar_nizam_report"
        )

        Spacer(modifier = Modifier.weight(1f))

        // Storage Quota Bar & Account Info
        StorageQuotaBar(
            quota = aboutInfo.storageQuota,
            userEmail = aboutInfo.userEmail
        )
    }
}

@Composable
private fun SidebarItem(
    label: String,
    icon: ImageVector,
    selected: Boolean,
    iconTint: Color,
    badge: String? = null,
    onClick: () -> Unit,
    testTag: String
) {
    NavigationDrawerItem(
        label = {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = label,
                    style = MaterialTheme.typography.bodyLarge,
                    color = if (selected) Color.White else Stone400,
                    fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal,
                    modifier = Modifier.weight(1f)
                )
                if (badge != null) {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .background(Emerald950)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = badge,
                            color = Emerald400,
                            style = MaterialTheme.typography.labelSmall
                        )
                    }
                }
            }
        },
        icon = {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (selected) Emerald400 else iconTint
            )
        },
        selected = selected,
        onClick = onClick,
        shape = RoundedCornerShape(8.dp),
        colors = NavigationDrawerItemDefaults.colors(
            selectedContainerColor = Stone800,
            unselectedContainerColor = Color.Transparent
        ),
        modifier = Modifier
            .padding(vertical = 2.dp)
            .testTag(testTag)
    )
}
