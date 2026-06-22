/**
 * GOOGLE APPS SCRIPT FOR WEDDING RSVP & WISHES (UCAPAN)
 * 
 * SPREADSHEET ID: 1C8qCbOyZC6UyaXjiocB5mkN0QUk69VmXz2wdGL7Hwi0
 * SHEET NAME: Sheet1
 * 
 * CARA MENGGUNAKAN:
 * 1. Buka Google Sheets Anda (https://docs.google.com/spreadsheets/d/1C8qCbOyZC6UyaXjiocB5mkN0QUk69VmXz2wdGL7Hwi0)
 * 2. Klik menu "Ekstensi" (Extensions) -> "Apps Script".
 * 3. Hapus semua kode default di editor, lalu salin dan tempel kode di bawah ini.
 * 4. Klik ikon Save (Simpan).
 * 5. Klik "Terapkan" (Deploy) -> "Terapkan baru" (New deployment).
 * 6. Pilih Jenis (Select type) -> "Aplikasi web" (Web app).
 * 7. Konfigurasi:
 *    - Deskripsi: RSVP & Ucapan Mey-Naz
 *    - Jalankan sebagai (Execute as): Saya (Me / Email Anda)
 *    - Siapa yang memiliki akses (Who has access): Siapa saja (Anyone)
 * 8. Klik "Terapkan" (Deploy).
 * 9. Salin URL Aplikasi Web yang diberikan (Web app URL), lalu tempelkan di file `index.html` pada bagian `const scriptUrl = "URL_ANDA_DISINI";`.
 */

function doGet(e) {
  var sheet = SpreadsheetApp.openById("1C8qCbOyZC6UyaXjiocB5mkN0QUk69VmXz2wdGL7Hwi0").getSheetByName("Sheet1");
  var data = sheet.getDataRange().getValues();
  var rows = [];
  
  // Jika sheet kosong, kembalikan data kosong
  if (data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ status: "success", data: [] }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Baris pertama (index 0) adalah Header: Timestamp, Nama Tamu, Ucapan, Konfirmasi Kehadiran, Jumlah Tamu
  for (var i = 1; i < data.length; i++) {
    rows.push({
      timestamp: data[i][0],
      nama: data[i][1],
      ucapan: data[i][2],
      kehadiran: data[i][3],
      jumlah: data[i][4]
    });
  }
  
  var result = JSON.stringify({ status: "success", data: rows });
  return ContentService.createTextOutput(result)
                       .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.openById("1C8qCbOyZC6UyaXjiocB5mkN0QUk69VmXz2wdGL7Hwi0").getSheetByName("Sheet1");
  
  // Pastikan baris header ada jika sheet masih kosong
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Nama Tamu", "Ucapan", "Konfirmasi Kehadiran", "Jumlah Tamu"]);
  }
  
  try {
    var params;
    if (e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
    } else {
      params = e.parameter;
    }
    
    var timestamp = new Date();
    var nama = params.nama || params.author || "";
    var ucapan = params.ucapan || params.comment || "";
    var kehadiran = params.kehadiran || params.attendance || "";
    var jumlah = params.jumlah || params.guest || "0";
    
    // Simpan ke Google Sheet
    sheet.appendRow([timestamp, nama, ucapan, kehadiran, jumlah]);
    
    var result = JSON.stringify({ status: "success", message: "Data berhasil disimpan!" });
    return ContentService.createTextOutput(result)
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    var result = JSON.stringify({ status: "error", message: error.toString() });
    return ContentService.createTextOutput(result)
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
