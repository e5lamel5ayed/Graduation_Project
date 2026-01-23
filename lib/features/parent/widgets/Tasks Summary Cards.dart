import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/features/parent/widgets/InfoCard.dart';

class TasksSummary extends StatelessWidget {
  final bool isNewUser;
  const TasksSummary({super.key, required this.isNewUser});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: InfoCard(
                title: "Earned Points",
                value: isNewUser ? "0" : "100",
                color: Colors.orange.shade100,
              ),
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: InfoCard(
                title: "Completed Tasks",
                value: isNewUser ? "0" : "12",
                color: Colors.purple.shade100,
              ),
            ),
          ],
        ),
        SizedBox(height: 12.h),
        Row(
          children: [
            Expanded(
              child: InfoCard(
                title: "Pending",
                value: isNewUser ? "0" : "15",
                color: Colors.blue.shade100,
              ),
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: InfoCard(
                title: "Rejected",
                value: isNewUser ? "0" : "2",
                color: Colors.red.shade100,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
