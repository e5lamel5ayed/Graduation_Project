import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class TabItem extends StatelessWidget {
  final String title;
  final int index;
  final int selectedIndex;
  final Function(int) onTap;

  const TabItem({
    super.key,
    required this.title,
    required this.index,
    required this.selectedIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final bool isSelected = index == selectedIndex;

    return Expanded(
      child: GestureDetector(
        onTap: () => onTap(index),
        child: AnimatedContainer(
        width: MediaQuery.of(context).size.width * 0.41,
        height: MediaQuery.of(context).size.height * 0.042,
        
          duration: const Duration(milliseconds: 200),
          padding:  EdgeInsets.symmetric(vertical: 8.h, horizontal: 8.w),
          decoration: BoxDecoration(
            color: isSelected ? Color(0xff9A87A4): Colors.transparent,
            borderRadius: BorderRadius.circular(16.r),
          ),
          child: Center(
            child: CustomText(iscenter: true, text: title,
            color: isSelected ? Colors.white : Colors.black54,
            size: 14.sp,
            weight: FontWeight.w400,
            )
          ),
        ),
      ),
    );
  }
}
