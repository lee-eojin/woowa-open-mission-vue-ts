import { ERROR_MESSAGES } from '@/constants/errorMessages'

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
      throw new Error(ERROR_MESSAGES.CSV.EMPTY_FILE)
    }
  }

  private extractHeaders(lines: string[]): string[] {
    const firstLine = lines[0]
    if (!firstLine) {
      throw new Error(ERROR_MESSAGES.CSV.MISSING_HEADER)
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
        throw new Error(ERROR_MESSAGES.CSV.MISSING_VALUE(header))
      }
      row[header] = value
    })

    return row
  }
}
