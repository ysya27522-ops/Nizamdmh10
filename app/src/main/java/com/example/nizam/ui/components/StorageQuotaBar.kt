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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Cloud
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nizam.data.model.StorageQuota
import com.example.nizam.ui.theme.Emerald400
import com.example.nizam.ui.theme.Emerald500
import com.example.nizam.ui.theme.Stone400
import com.example.nizam.ui.theme.Stone700
import com.example.nizam.ui.theme.Stone800

@Composable
fun StorageQuotaBar(
    quota: StorageQuota,
    userEmail: String,
    modifier: Modifier = Modifier
) {
    Surface(
        color = Stone800,
        shape = RoundedCornerShape(12.dp),
        modifier = modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(24.dp)
                        .clip(CircleShape)
                        .background(Emerald500.copy(alpha = 0.2f))
                ) {
                    Icon(
                        imageVector = Icons.Default.Cloud,
                        contentDescription = null,
                        tint = Emerald400,
                        modifier = Modifier.size(16.dp)
                    )
                }
                Spacer(modifier = Modifier.padding(horizontal = 4.dp))
                Text(
                    text = "مساحة التخزين السحابية",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.White
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            LinearProgressIndicator(
                progress = { quota.usagePercentage },
                color = Emerald500,
                trackColor = Stone700,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(RoundedCornerShape(3.dp))
            )

            Spacer(modifier = Modifier.height(6.dp))

            Row(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "${quota.formattedUsage} من أصل ${quota.formattedLimit}",
                    style = MaterialTheme.typography.labelSmall,
                    color = Stone400
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = userEmail,
                style = MaterialTheme.typography.labelSmall,
                color = Stone400,
                fontSize = 10.sp
            )
        }
    }
}
