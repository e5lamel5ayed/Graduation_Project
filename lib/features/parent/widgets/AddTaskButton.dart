import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/svg.dart';
import 'package:rewarding_kids/Shared/CustomText.dart';

class AddTaskButton extends StatelessWidget {
  final VoidCallback onTap;

  const AddTaskButton({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [
              Color(0xFFF262AD), // pink
              Color(0xFFA16CFA), //  purple
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(8.r),
          /*  boxShadow: [
            BoxShadow(
              color: Colors.purple.withOpacity(0.35),
              blurRadius: 8,
              offset: const Offset(0, 4),
            )
          ],*/
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
          SvgPicture.asset("assets/icons/addtask.svg", height: 24.h, width: 24.w,),
            SizedBox(width: 4),
            CustomText(text: "Add Task", iscenter: true, size: 12.sp, color: Colors.white, weight: FontWeight.w500,),
          ],
        ),
      ),
    );
  }
}
