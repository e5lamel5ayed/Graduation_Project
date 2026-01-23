import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:rewarding_kids/features/Parent_registar/views/Account_done_view.dart';
import 'package:rewarding_kids/features/Parent_registar/views/Age_view.dart';
import 'package:rewarding_kids/features/Parent_registar/views/Avatar_view.dart';
import 'package:rewarding_kids/features/Parent_registar/views/Child_gender_view.dart';
import 'package:rewarding_kids/features/Parent_registar/views/Child_name_view.dart';
import 'package:rewarding_kids/features/Parent_registar/views/Relation_view.dart';
import 'package:rewarding_kids/features/auth/views/Forgetpass_view.dart';
import 'package:rewarding_kids/features/auth/views/login_view.dart';
import 'package:rewarding_kids/features/auth/views/otp1_view.dart';
import 'package:rewarding_kids/features/auth/views/resetpass1_view.dart';
import 'package:rewarding_kids/features/auth/views/resetpass2_view.dart';
import 'package:rewarding_kids/features/auth/views/signup_view.dart';
import 'package:rewarding_kids/features/child/data/task_model.dart';
import 'package:rewarding_kids/features/child/views/Home_child_view.dart';
import 'package:rewarding_kids/features/child/views/Pending_view.dart';
import 'package:rewarding_kids/features/child/views/TakeImage.dart';
import 'package:rewarding_kids/features/child/views/Task_compeleted_view.dart';
import 'package:rewarding_kids/features/child/views/Task_view.dart';
import 'package:rewarding_kids/features/child/views/do_task_view.dart';
import 'package:rewarding_kids/features/child/views/qrcode_view.dart';

import 'package:rewarding_kids/features/child/views/record_completed.dart';
import 'package:rewarding_kids/features/child/views/record_task_view.dart';
import 'package:rewarding_kids/features/child/views/voice_task_view.dart';
import 'package:rewarding_kids/features/child/widgets/CustomBottomNav.dart';
import 'package:rewarding_kids/features/child/widgets/uploadimage.dart';
import 'package:rewarding_kids/features/onboarding/views/getstart_view.dart';
import 'package:rewarding_kids/features/onboarding/views/onboarding_view.dart';
import 'package:rewarding_kids/features/parent/views/add_task_screen.dart';
import 'package:rewarding_kids/features/parent/views/layout_view.dart';
import 'package:rewarding_kids/splash_view.dart';

class AppRouter {
  static final GoRouter router = GoRouter(
    // on boarding
    initialLocation: '/SplashView',
    routes: [
      GoRoute(
        path: '/SplashView',
        builder: (context, state) => const SplashView(),
      ),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingView(),
      ),
      //auth
      GoRoute(
        path: '/getstarted',
        builder: (context, state) => const GetstartView(),
      ),
      GoRoute(path: '/login', builder: (context, state) => const LoginView()),
      GoRoute(path: '/signup', builder: (context, state) => const SignupView()),
      GoRoute(
        path: '/forgetpass',
        builder: (context, state) => const ForgetpassView(),
      ),
      GoRoute(path: '/otp1', builder: (context, state) => const Otp1View()),

      GoRoute(
        path: '/resetpass1',
        builder: (context, state) => const Resetpass1View(),
      ),
      GoRoute(
        path: '/resetpass2',
        builder: (context, state) => const Resetpass2View(),
      ),

      //parent_registar
      GoRoute(
        path: '/child_name',
        builder: (context, state) => const ChildNameView(),
      ),
      GoRoute(
        path: '/child_gender',
        builder: (context, state) => const ChildGenderView(),
      ),
      GoRoute(path: '/age', builder: (context, state) => const AgeView()),
      GoRoute(
        path: '/relation',
        builder: (context, state) => const RelationView(),
      ),
      GoRoute(path: '/avatar', builder: (context, state) => const AvatarView()),
      GoRoute(
        path: '/account_done',
        builder: (context, state) => const AccountDoneView(),
      ),
      GoRoute(
        path: '/home_child',
        builder: (context, state) => const HomeChildView(),
      ),
      GoRoute(
        path: '/task_view',
        builder: (context, state) {
          final task = state.extra as TaskModel?;
          if (task == null) {
            return Scaffold(body: Center(child: Text('No task data!')));
          }
          return TaskView(Taskdetails: task);
        },
      ),
      GoRoute(
        path: '/Custombottomnav',
        builder: (context, state) => CustomBottomNav(),
      ),
      GoRoute(
        path: '/do_task',
        builder: (context, state) {
          final task = state.extra as TaskModel?;
          if (task == null) {
            return Scaffold(body: Center(child: Text('No task data!')));
          }
          return DoTaskView(Taskdetails: task);
        },
      ),
      GoRoute(
        path: '/task_completed',
        builder: (context, state) {
          final task = state.extra as TaskModel?; // ? مهم للتحقق
          if (task == null) {
            return Scaffold(
              body: Center(child: Text('No task data!')), // رسالة بديلة
            );
          }
          return TaskCompletedView(taskDetails: task);
        },
      ),
      GoRoute(
        path: '/voice_task',
        builder: (context, state) {
          final task = state.extra as TaskModel?; // ? مهم للتحقق
          if (task == null) {
            return Scaffold(
              body: Center(child: Text('No task data!')), // رسالة بديلة
            );
          }
          return VoiceTaskView(Taskdetails: task);
        },
      ),
      GoRoute(
        path: '/record_task',
        builder: (context, state) {
          final task = state.extra as TaskModel?;

          if (task == null) {
            return Scaffold(body: Center(child: Text('No task data!')));
          }

          return RecordTaskView(Taskdetails: task);
        },
      ),

      GoRoute(
        path: '/record_completed',
        builder: (context, state) {
          final data = state.extra as Map?;

          if (data == null) {
            return Scaffold(body: Center(child: Text('No task data!')));
          }

          final task = data["task"] as TaskModel;
          final audioPath = data["audio_path"] as String;

          return RecordCompletedView(Taskdetails: task, audioPath: audioPath);
        },
      ),

      GoRoute(
        path: '/take_image',
        builder: (context, state) {
          final task = state.extra as TaskModel?;

          if (task == null) {
            return Scaffold(body: Center(child: Text('No task data!')));
          }

          return Takeimage(Taskdetails: task);
        },
      ),

      GoRoute(
        path: '/pending',
        builder: (context, state) {
          final data = state.extra as Map?;

          if (data == null) {
            return Scaffold(body: Center(child: Text('No task data!')));
          }

          final task = data["task"] as TaskModel;

          final imagepath = data["image_path"] as String?;

          return PendingView(Taskdetails: task, imagePath: imagepath);
        },
      ),

      GoRoute(
        path: '/uploadimage',
        builder: (context, state) {
          final data = state.extra as Map?;

          if (data == null) {
            return Scaffold(body: Center(child: Text('No task data!')));
          }

          final task = data["task"] as TaskModel;

          final imagepath = data["image_path"] as String?;

          return Uploadimage(Taskdetails: task, imagePath: imagepath);
        },
      ),
      GoRoute(
        path: '/qrcode',
        builder: (context, state) => const QRScannerView(),
      ),
      GoRoute(path: '/Layout', builder: (context, state) => const LayoutView()),
      GoRoute(
        path: '/addtask',
        builder: (context, state) => const AddTaskScreen(),
      ),
    ],
  );
}
