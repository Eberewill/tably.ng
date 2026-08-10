pub enum DeviceKind { ThermalPrinter, CashDrawer, BarcodeScanner, CustomerDisplay }
pub struct Device { pub id: String, pub name: String, pub kind: DeviceKind }
