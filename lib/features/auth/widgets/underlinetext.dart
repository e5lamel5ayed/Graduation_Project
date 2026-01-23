import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class Underlinetext extends StatelessWidget {
  const Underlinetext({
    super.key,
    required this.text,
    required this.underlinetext,
    required this.onPressed,
  });

  final String text;
  final String underlinetext;
  final void Function()? onPressed;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: RichText(
        text: TextSpan(
          children: [
            TextSpan(
              text: text,
              style: TextStyle(
                color: AppColors.descColor,
                fontSize: 14.sp,
              ),
            ),
            TextSpan(
              text: underlinetext,
              style: TextStyle(
                fontSize: 14.sp,
                color: AppColors.titleColor,
                decoration: TextDecoration.underline,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
