import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';
import 'package:rewarding_kids/features/Parent_registar/logic/age_cubit.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';

class AgeButtons extends StatefulWidget {
  final double spacingWidth;
  final double spacingHeight;

  const AgeButtons({
    super.key,
    required this.spacingWidth,
    required this.spacingHeight,
  });

  @override
  State<AgeButtons> createState() => _AgeButtonsState();
}

class _AgeButtonsState extends State<AgeButtons> {
  int currentAge = 6; // القيمة الابتدائية
  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;


        return Wrap(
          spacing: widget.spacingWidth,
          runSpacing: widget.spacingHeight,
          children: [
            Container(
              width: size.width * 0.7,
              height: size.width * 0.12,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(99),
              ),
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 8.h),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // زر -
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          if (currentAge > 1) currentAge--;
                        });
                      },
                      child: Container(
                        width: size.width * 0.1,
                        height: size.width * 0.1,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.Countercolor,
                        ),
                        alignment: Alignment.center,
                        child: Icon(Icons.remove,color: Colors.white,)
                      ),
                    ),

                    // الرقم في المنتصف
                    CustomText(
                      text: '$currentAge',
                      iscenter: true,
                      color: AppColors.titleColor,
                      size: 22.sp,
                      weight: FontWeight.w500,
                    ),

                    // زر +
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          if (currentAge < 18) currentAge++;
                        });
                      },
                      child: Container(
                        width: size.width * 0.1,
                        height: size.width * 0.1,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.Countercolor,
                        ),
                        alignment: Alignment.center,
                        child:  Icon(Icons.add,color: Colors.white,)
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        );
      }}

