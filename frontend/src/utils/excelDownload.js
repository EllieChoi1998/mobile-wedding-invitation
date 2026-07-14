function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Download rows as an Excel-compatible SpreadsheetML (.xls) file.
 * @param {string[]} headers
 * @param {Array<Array<string|number|boolean>>} rows
 * @param {string} filename Base name without extension
 * @param {string} [sheetName]
 */
export function downloadExcel(headers, rows, filename, sheetName = 'Sheet1') {
  const cell = (value) => {
    const str = String(value ?? '')
    const isNumber = typeof value === 'number' || (/^-?\d+(\.\d+)?$/.test(str) && str !== '')
    const type = isNumber && typeof value === 'number' ? 'Number' : 'String'
    return `<Cell><Data ss:Type="${type}">${escapeXml(str)}</Data></Cell>`
  }

  const rowXml = (cols) => `<Row>${cols.map(cell).join('')}</Row>`

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Worksheet ss:Name="${escapeXml(sheetName)}">
  <Table>
   ${rowXml(headers)}
   ${rows.map((row) => rowXml(row)).join('\n   ')}
  </Table>
 </Worksheet>
</Workbook>`

  const blob = new Blob([xml], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  const safeName = filename.endsWith('.xls') ? filename : `${filename}.xls`
  anchor.href = url
  anchor.download = safeName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
