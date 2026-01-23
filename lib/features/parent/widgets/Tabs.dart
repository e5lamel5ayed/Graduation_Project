import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class StatsTabs extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: const [
        _TabItem(title: "This Week", isActive: true),
        _TabItem(title: "This Month"),
        _TabItem(title: "All"),
      ],
    );
  }
}

class _TabItem extends StatelessWidget {
  final String title;
  final bool isActive;

  const _TabItem({required this.title, this.isActive = false});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: TextStyle(
        fontSize: 12.sp,
        fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
      ),
    );
  }
}
