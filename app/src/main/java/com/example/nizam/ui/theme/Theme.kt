package com.example.nizam.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val NizamDarkColorScheme = darkColorScheme(
    primary = Emerald500,
    onPrimary = Color.White,
    primaryContainer = Emerald950,
    onPrimaryContainer = Emerald400,
    secondary = Teal400,
    onSecondary = Color.Black,
    secondaryContainer = Stone800,
    onSecondaryContainer = Stone200,
    tertiary = Amber400,
    onTertiary = Color.Black,
    background = Stone950,
    onBackground = Stone100,
    surface = Stone900,
    onSurface = Stone100,
    surfaceVariant = Stone850,
    onSurfaceVariant = Stone300,
    outline = Stone700,
    outlineVariant = Stone800,
    error = Rose500,
    onError = Color.White
)

@Composable
fun NizamTheme(
    darkTheme: Boolean = true, // Default to rich dark stone palette matching web
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = NizamDarkColorScheme,
        typography = Typography,
        content = content
    )
}
