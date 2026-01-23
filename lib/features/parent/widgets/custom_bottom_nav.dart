import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:rewarding_kids/features/parent/cubit/layout_cubit/layout_cubit.dart';
import 'package:rewarding_kids/features/parent/cubit/layout_cubit/layout_state.dart';
import 'package:rewarding_kids/features/parent/widgets/nav_item.dart';
class CustomBottomNav2 extends StatelessWidget {
  const CustomBottomNav2({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LayoutCubit, LayoutState>(
      builder: (context, state) {
        return Padding(
          padding:  EdgeInsets.symmetric(horizontal: 16.w,vertical: 10.h),
          child: Container(
            width: MediaQuery.of(context).size.width * 0.9,
            height: MediaQuery.of(context).size.height * 0.09,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius:  BorderRadius.all(
               Radius.circular(20.r),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 10,
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                NavItem(
                  icon: "assets/icons/home.svg",
                  index: 0,
                  isSelected: state.currentIndex == 0, label: 'Home',
                ),
                NavItem(
                  icon: "assets/icons/tasks1.svg",
                  index: 1,
                  isSelected: state.currentIndex == 1, label: 'Tasks',
                ),
                NavItem(
                  icon: "assets/icons/gifts.svg",
                  index: 2,
                  isSelected: state.currentIndex == 2, label: 'Gifts',
                ),
                NavItem(
                  icon: "assets/icons/setting.svg",
                  index: 3,
                  isSelected: state.currentIndex == 3, label: 'Setting',
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
