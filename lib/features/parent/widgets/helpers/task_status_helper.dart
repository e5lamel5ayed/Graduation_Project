import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:rewarding_kids/features/parent/cubit/tasks_cubit/task_list_state.dart';


Color taskStatusColor(TaskStatus status) {
  switch (status) {
    case TaskStatus.completed:
      return Color(0xff00A600);
    case TaskStatus.pending:
      return Color(0xffE0B700);
    case TaskStatus.inReview:
      return Color(0xffBDE0FE);
    case TaskStatus.rejected:
      return Color(0xffFF5792);
    case TaskStatus.all:
      return Colors.grey;
  }
}

 String taskStatusIcon(TaskStatus status) {
  switch (status) {
    case TaskStatus.completed:
      return 'assets/icons/Completed.svg';
    case TaskStatus.pending:
      return 'assets/icons/pinding.svg';
    case TaskStatus.inReview:
      return 'assets/icons/inreview.svg';
    case TaskStatus.rejected:
      return 'assets/icons/regected.svg';
    case TaskStatus.all:
      return 'assets/icons/regected.svg';
  }
}
