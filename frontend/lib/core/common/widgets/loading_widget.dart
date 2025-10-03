import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class WebLoginLoadingScreen extends StatelessWidget {
  const WebLoginLoadingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Copy your colors/animations as close as possible to HTML/CSS
    return Container(
      color: Colors.white,
      alignment: Alignment.center,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Your SVG logo (same as HTML <img src="specialty_rx_logo.svg">)
          SizedBox(
            width: 168,
            height: 49,
            child: SvgPicture.asset(
              'assets/images/specialty_rx_logo.svg',
              fit: BoxFit.contain,
            ),
          ),
          const SizedBox(height: 32),
          // Loading dots
          Row(
            mainAxisSize: MainAxisSize.min,
            children: List.generate(
              3,
              (index) => _AnimatedDot(delay: index * 200),
            ),
          ),
        ],
      ),
    );
  }
}

class _AnimatedDot extends StatefulWidget {
  final int delay; // ms

  const _AnimatedDot({required this.delay});

  @override
  State<_AnimatedDot> createState() => _AnimatedDotState();
}

class _AnimatedDotState extends State<_AnimatedDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;
  late Animation<double> _opacityAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );
    _scaleAnim = TweenSequence([
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 1.2), weight: 50),
      TweenSequenceItem(tween: Tween(begin: 1.2, end: 1.0), weight: 50),
    ]).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
    _opacityAnim = TweenSequence([
      TweenSequenceItem(tween: Tween(begin: 0.3, end: 1.0), weight: 50),
      TweenSequenceItem(tween: Tween(begin: 1.0, end: 0.3), weight: 50),
    ]).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
    // Delay the start, so dots are staggered
    Future.delayed(Duration(milliseconds: widget.delay), () {
      if (mounted) _controller.repeat();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (ctx, child) {
        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 4),
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: const Color(
              0xFF6D8E9D,
            ).withValues(alpha: _opacityAnim.value),
            borderRadius: BorderRadius.circular(8),
          ),
          // transform: Matrix4.identity()..scale(_scaleAnim.value),
        );
      },
    );
  }
}
