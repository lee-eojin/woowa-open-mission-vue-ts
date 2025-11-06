export class CsvParser {
  parse(csvText: string): Record<string, string>[] {
    const lines = this.splitLines(csvText)
    this.validateLines(lines)

    const headers = this.extractHeaders(lines)
    return this.parseDataRows(lines, headers)
  }

  private splitLines(csvText: string): string[] {
    return csvText.trim().split('\n').filter(line => line.length > 0)
  }

  private validateLines(lines: string[]): void {
    if (lines.length === 0) {
      throw new Error('[ERROR] CSV 파일이 비어있습니다.')
    }
  }

  private extractHeaders(lines: string[]): string[] {
    const firstLine = lines[0]
    if (!firstLine) {
      throw new Error('[ERROR] 헤더가 없습니다.')
    }
    return firstLine.split(',')
  }

  private parseDataRows(lines: string[], headers: string[]): Record<string, string>[] {
    return lines.slice(1).map((line) => this.parseRow(line, headers))
  }

  private parseRow(line: string, headers: string[]): Record<string, string> {
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
  }
}
