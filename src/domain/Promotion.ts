export class Promotion {
  constructor(
    public readonly name: string,
    public readonly buy: number,
    public readonly get: number,
    public readonly startDate: Date,
    public readonly endDate: Date
  ) {}

  isActive(currentDate: Date = new Date()): boolean {
    return currentDate >= this.startDate && currentDate <= this.endDate
  }

  getTotalQuantity(): number {
    return this.buy + this.get
  }
}
