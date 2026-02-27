const currentYear = new Date().getFullYear()

export const years = Array.from({ length: 35 }, (_, i) => String(currentYear - i))

export const makes = [
  'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler',
  'Dodge', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jeep', 'Kia',
  'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan',
  'Pontiac', 'Ram', 'Saturn', 'Subaru', 'Toyota', 'Volkswagen', 'Volvo',
]
