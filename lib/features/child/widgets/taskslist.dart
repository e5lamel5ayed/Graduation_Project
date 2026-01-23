import 'package:flutter/material.dart';
import '../data/task_model.dart';
import 'Taskcard.dart';

class Taskslist extends StatelessWidget {
  const Taskslist({super.key, required this.tasks});
  final List<TaskModel> tasks;

  @override
  Widget build(BuildContext context) {
    // ListView بدون أي SingleChildScrollView أو shrinkWrap → Scroll طبيعي
    return ListView.builder(
      itemCount: tasks.length,
      itemBuilder: (BuildContext context, int index) {
        final task = tasks[index];
        return Taskcard(task: task);
      },
    );
  }
}
