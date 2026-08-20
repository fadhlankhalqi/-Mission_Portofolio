param(
  [string]$OutputPath = (Join-Path $PSScriptRoot 'Fadlan_Khalqi_Carousel_Portfolio_Full-Stack.pdf')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$slidePaths = 1..10 | ForEach-Object {
  Join-Path $PSScriptRoot ('exports\slide-{0:D2}.png' -f $_)
}

foreach ($slidePath in $slidePaths) {
  if (-not (Test-Path -LiteralPath $slidePath -PathType Leaf)) {
    throw "Slide tidak ditemukan: $slidePath"
  }
}

function Write-Ascii {
  param(
    [System.IO.Stream]$Stream,
    [string]$Text
  )
  $bytes = [System.Text.Encoding]::ASCII.GetBytes($Text)
  $Stream.Write($bytes, 0, $bytes.Length)
}

function Convert-ToJpegBytes {
  param([string]$Path)

  $source = [System.Drawing.Image]::FromFile($Path)
  try {
    $bitmap = New-Object System.Drawing.Bitmap($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.Clear([System.Drawing.Color]::White)
        $graphics.DrawImage($source, 0, 0, $source.Width, $source.Height)
      }
      finally {
        $graphics.Dispose()
      }

      $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq 'image/jpeg' } |
        Select-Object -First 1
      $qualityEncoder = [System.Drawing.Imaging.Encoder]::Quality
      $encoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $encoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($qualityEncoder, [long]95)

      $memory = New-Object System.IO.MemoryStream
      try {
        $bitmap.Save($memory, $jpegCodec, $encoderParameters)
        return ,$memory.ToArray()
      }
      finally {
        $memory.Dispose()
        $encoderParameters.Dispose()
      }
    }
    finally {
      $bitmap.Dispose()
    }
  }
  finally {
    $source.Dispose()
  }
}

$jpegSlides = $slidePaths | ForEach-Object { Convert-ToJpegBytes -Path $_ }
$pageWidth = 576
$pageHeight = 720
$objectCount = 2 + ($jpegSlides.Count * 3)
$offsets = New-Object 'long[]' ($objectCount + 1)
$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
  New-Item -ItemType Directory -Path $outputDirectory | Out-Null
}

$stream = New-Object System.IO.FileStream($OutputPath, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)
try {
  Write-Ascii $stream "%PDF-1.4`n%PDF-CAROUSEL`n"

  $offsets[1] = $stream.Position
  Write-Ascii $stream "1 0 obj`n<< /Type /Catalog /Pages 2 0 R >>`nendobj`n"

  $pageObjects = for ($index = 0; $index -lt $jpegSlides.Count; $index++) { 3 + ($index * 3) }
  $kids = ($pageObjects | ForEach-Object { "$_ 0 R" }) -join ' '
  $offsets[2] = $stream.Position
  Write-Ascii $stream "2 0 obj`n<< /Type /Pages /Kids [$kids] /Count $($jpegSlides.Count) >>`nendobj`n"

  for ($index = 0; $index -lt $jpegSlides.Count; $index++) {
    $pageObject = 3 + ($index * 3)
    $imageObject = $pageObject + 1
    $contentObject = $pageObject + 2
    $jpegBytes = $jpegSlides[$index]

    $offsets[$pageObject] = $stream.Position
    Write-Ascii $stream "$pageObject 0 obj`n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 $pageWidth $pageHeight] /Resources << /XObject << /Im0 $imageObject 0 R >> >> /Contents $contentObject 0 R >>`nendobj`n"

    $offsets[$imageObject] = $stream.Position
    Write-Ascii $stream "$imageObject 0 obj`n<< /Type /XObject /Subtype /Image /Width 1080 /Height 1350 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length $($jpegBytes.Length) >>`nstream`n"
    $stream.Write($jpegBytes, 0, $jpegBytes.Length)
    Write-Ascii $stream "`nendstream`nendobj`n"

    $content = "q`n$pageWidth 0 0 $pageHeight 0 0 cm`n/Im0 Do`nQ`n"
    $contentBytes = [System.Text.Encoding]::ASCII.GetBytes($content)
    $offsets[$contentObject] = $stream.Position
    Write-Ascii $stream "$contentObject 0 obj`n<< /Length $($contentBytes.Length) >>`nstream`n"
    $stream.Write($contentBytes, 0, $contentBytes.Length)
    Write-Ascii $stream "endstream`nendobj`n"
  }

  $xrefOffset = $stream.Position
  Write-Ascii $stream "xref`n0 $($objectCount + 1)`n"
  Write-Ascii $stream "0000000000 65535 f `n"
  for ($objectNumber = 1; $objectNumber -le $objectCount; $objectNumber++) {
    Write-Ascii $stream ("{0:D10} 00000 n `n" -f $offsets[$objectNumber])
  }
  Write-Ascii $stream "trailer`n<< /Size $($objectCount + 1) /Root 1 0 R >>`nstartxref`n$xrefOffset`n%%EOF`n"
}
finally {
  $stream.Dispose()
}

Get-Item -LiteralPath $OutputPath | Select-Object FullName, Length, LastWriteTime
