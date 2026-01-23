import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';

class GiftCard extends StatelessWidget {
  final String title;
  final String imageUrl;
  final int points;
  final String buttonText;
  final VoidCallback onPressed;
  final BoxFit fit;

  const GiftCard({
    super.key,
    required this.title,
    required this.imageUrl,
    required this.points,
    required this.buttonText,
    required this.onPressed, required this.fit,
  });

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10.r,
            offset: Offset(0, 4.h),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          /// 🖼 Image
          SizedBox(
            height: width > 600 ? 120.h : 100.h,
            width: double.infinity,
            child: ClipRRect(
              borderRadius: BorderRadius.vertical(top: Radius.circular(16.r)),
              child: Image.asset(imageUrl, fit: fit),
            ),
          ),

          /// 📦 Content
          Expanded(
            child: Padding(
              padding: EdgeInsets.all(12.w),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  /// 🎁 Title
                  Flexible(
                    child: CustomText(
                      text: title,
                      weight: FontWeight.w500,
                      color: Color(0xff5C5163),
                      size: 14.sp,
                      iscenter: true,
                    ),
                  ),
  SizedBox(height: 20.h),

                  /// 🎯 Target & Points
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          SvgPicture.asset(
                            'assets/gifts/target.svg',
                            width: 12.w,
                            height: 12.h,
                          ),
                          SizedBox(width: 6.w),
                          CustomText(
                            text: 'Target',
                            size: 12.sp,
                            color: Color(0xff5C5163),
                            iscenter: true,
                          ),
                        ],
                      ),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Image.asset(
                            'assets/child/coins.png',
                            width: 16.w,
                            height: 16.h,
                          ),
                          SizedBox(width: 6.w),
                          CustomText(
                            text: '$points',
                            size: 13.sp,
                            weight: FontWeight.w500,
                            iscenter: true,
                            color: Color(0xff5C5163),
                          ),
                        ],
                      ),
                    ],
                  ),

                  SizedBox(height: 12.h),

                  /// 🔘 Button
                  SizedBox(
                    width: double.infinity,
                    height: 32.h,
                    child: GestureDetector(
                      onTap: onPressed,
                      child: Container(
                          width: 150.w,
                    height: 32.h,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xffF68EC2), Color(0xffA077F1)],
                          ),
                          borderRadius: BorderRadius.circular(8.r),
                        ),
                        alignment: Alignment.center,
                        child: CustomText(
                          text: buttonText,
                          color: Colors.white,
                          weight: FontWeight.w600,
                          size: 14.sp,
                          iscenter: true,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
