import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:rewarding_kids/features/parent/cubit/layout_cubit/layout_cubit.dart';
class NavItem extends StatelessWidget {
  
  
  final String icon;
  final String label;
  final int index;
  final bool isSelected;

  const NavItem({
    required this.icon,
    required this.label,
    required this.index,
    required this.isSelected,
  });

  @override
  Widget build(BuildContext context) {
  

    return GestureDetector(
      onTap: () {
        context.read<LayoutCubit>().changeTab(index);
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // الخط اللي فوق
          AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            height: 3,
            width: isSelected ? 24 : 0,
            margin: const EdgeInsets.only(bottom: 6),
            decoration: BoxDecoration(
              color:Color(0xff9A87A4),
              borderRadius: BorderRadius.circular(4),
            ),
          ),

          // الأيقونة
        SvgPicture.asset(
          icon,
          height: 24.h,
          width: 24.w,
          color: isSelected ? Color(0xff593D47) : Colors.grey,
        ),

        SizedBox(height: 4.h),

          // النص
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: isSelected ? Color(0xff593D47) : Colors.grey,
              fontWeight:
                  isSelected ? FontWeight.w600 : FontWeight.w400,
            ),
          ),
        ],
      ),
    );
  }
}

