import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class PerformanceSection extends StatelessWidget {
  final bool isNewUser;
  const PerformanceSection({super.key, required this.isNewUser});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20.r),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Performance",
            style: TextStyle(fontSize: 14.sp, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8.h),
          LinearProgressIndicator(value: isNewUser ? 0.0 : 0.7),
          SizedBox(height: 8.h),
          Text(
            isNewUser ? "No data yet" : "Improvement over previous period +12%",
            style: TextStyle(fontSize: 12.sp),
          ),
        ],
      ),
    );
  }
}
