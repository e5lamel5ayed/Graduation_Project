import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class Otpwidget extends StatelessWidget {
  Otpwidget({super.key, required this.secondsRemaining, required this.enableResend, required this.otpControllers});

  final int secondsRemaining;
  final bool enableResend;
  final List<TextEditingController> otpControllers;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(height: 40.h),

        // OTP Fields
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: List.generate(
            4,
                (index) => SizedBox(
              width: 48.w,
              height: 48.h,
              child: TextField(
                controller: otpControllers[index],
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16.sp),
                keyboardType: TextInputType.number,
                maxLength: 1,
                decoration: InputDecoration(
                  counterText: "",
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderSide: BorderSide.none,
                    borderRadius: BorderRadius.circular(8.r),
                  ),
                ),
                onChanged: (val) {
                  if (val.isNotEmpty && index < 3) {
                    FocusScope.of(context).nextFocus();
                  }
                },
              ),
            ),
          ),
        ),

        SizedBox(height: 20.h),

        CustomText(
          text: enableResend
              ? "00:00"
              : "00:${secondsRemaining.toString().padLeft(2, '0')}",
          iscenter: true,
          color: AppColors.titleColor,
          weight: FontWeight.w400,
          size: 20.sp,
        ),

        SizedBox(height: 24.h),
      ],
    );
  }
}
