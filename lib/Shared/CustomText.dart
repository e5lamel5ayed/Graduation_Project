import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CustomText extends StatelessWidget {
  const CustomText( {
    super.key,
    required this.text,
    this.color,
    this.size,
    this.weight,
    required this.iscenter,
  });

  final String text;
  final Color? color;
  final double? size;
  final FontWeight? weight;
  final bool iscenter;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      maxLines: 10,
      overflow: TextOverflow.ellipsis,
      textAlign: iscenter ? TextAlign.center : TextAlign.left,
      style: TextStyle(
        fontSize: size?.sp ?? 16.sp,
        color: color,
        fontWeight: weight,
      ),
    );
  }
}
