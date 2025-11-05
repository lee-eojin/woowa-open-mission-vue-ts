export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n').filter(line => line.length > 0)

  if (lines.length === 0) {
    throw new Error('[ERROR] CSV 파일이 비어있습니다.')
  }

  const firstLine = lines[0]
  if (!firstLine) {
    throw new Error('[ERROR] 헤더가 없습니다.')
  }

  const headers = firstLine.split(',')

  return lines.slice(1).map((line) => {
    const values = line.split(',')
    const row: Record<string, string> = {}

    headers.forEach((header, index) => {
      const value = values[index]
      if (value === undefined) {
        throw new Error(`[ERROR] ${header} 값이 없습니다.`)
      }
      row[header] = value
    })

    return row
  })
}
