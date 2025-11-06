export class Promotion {
  constructor(
    private readonly name: string,
    private readonly buy: number,
    private readonly get: number,
    private readonly startDate: Date,
    private readonly endDate: Date
  ) {}

  getName(): string {
    return this.name
  }

  getBuy(): number {
    return this.buy
  }

  getGet(): number {
    return this.get
  }

  getStartDate(): Date {
    return this.startDate
  }

  getEndDate(): Date {
    return this.endDate
  }

  isActive(currentDate: Date = new Date()): boolean {
    return currentDate >= this.startDate && currentDate <= this.endDate
  }

  getTotalQuantity(): number {
    return this.buy + this.get
  }
}
