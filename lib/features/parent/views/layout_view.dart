import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:rewarding_kids/core/constants/app_colors.dart';
import 'package:rewarding_kids/features/parent/cubit/layout_cubit/layout_cubit.dart';
import 'package:rewarding_kids/features/parent/cubit/layout_cubit/layout_state.dart';
import 'package:rewarding_kids/features/parent/views/HomeView.dart';
import 'package:rewarding_kids/features/parent/views/gift_view.dart';

import 'package:rewarding_kids/features/parent/views/setting_view.dart';
import 'package:rewarding_kids/features/parent/views/task_view.dart';
import 'package:rewarding_kids/features/parent/widgets/custom_bottom_nav.dart';

class LayoutView extends StatelessWidget {
  const LayoutView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => LayoutCubit(),
      child: BlocBuilder<LayoutCubit, LayoutState>(
        builder: (context, state) {
          return SafeArea(
            child: Scaffold(
              backgroundColor: AppColors.Background,
              body: _screens[state.currentIndex],
              bottomNavigationBar: CustomBottomNav2(),
            ),
          );
        },
      ),
    );
  }
}

final List<Widget> _screens = [
  HomeView(),
  TasksView(),
  GiftsView(),
  SettingView(),
];
