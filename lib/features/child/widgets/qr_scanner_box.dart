/*import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

class QrScannerBox extends StatelessWidget {
  final GlobalKey qrKey;
  final Function(QRViewController) onQRViewCreated;

  const QrScannerBox({
    super.key,
    required this.qrKey,
    required this.onQRViewCreated,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 260.w,
      height: 260.w,
      child: QRView(
        key: qrKey,
        onQRViewCreated: onQRViewCreated,
        overlay: QrScannerOverlayShape(
          borderColor: Colors.transparent,
          cutOutSize: 260.w,
        ),
      ),
    );
  }
}*/
