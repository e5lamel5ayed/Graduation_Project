import 'package:flutter/material.dart';

class AssignTaskButton extends StatelessWidget {
  const AssignTaskButton({super.key});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Task assigned successfully'),
          ),
        );
      },
      child: const Text('Assign the task to the child'),
    );
  }
}
