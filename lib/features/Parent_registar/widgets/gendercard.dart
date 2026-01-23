import'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';

import 'package:rewarding_kids/core/constants/app_colors.dart';
class GenderCard extends StatelessWidget {
  final String title;
  final String iconPath;
  final bool isSelected;
  final VoidCallback onTap;
  final Color gendercolor;

  const GenderCard({
    required this.title,
    required this.iconPath,
    required this.isSelected,
    required this.onTap, required this.gendercolor,
  });

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: size.height * 0.15,
        width: size.width * 0.35,
        decoration: BoxDecoration(
          color: isSelected ? gendercolor: Colors.white,
          borderRadius: BorderRadius.circular(8.r),
          border: Border.all(
            color: isSelected ?gendercolor : Colors.white,
            width: 2,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SvgPicture.asset(iconPath, height: size.height * 0.09),
            SizedBox(height: size.height * 0.015),
            CustomText(
              text: title,
              color: AppColors.titleColor,
              size: size.width * 0.04,
              weight: FontWeight.w600, iscenter: true,
            ),
          ],
        ),
      ),
    );
  }
}