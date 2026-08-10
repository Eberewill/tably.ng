pub enum PrintWidth { Mm58, Mm80, A5, A4 }
pub struct PrintJob { pub printer_name: String, pub payload: Vec<u8>, pub width: PrintWidth }
