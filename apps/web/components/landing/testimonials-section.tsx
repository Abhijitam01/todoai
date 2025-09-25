"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GlassCard } from "@/components/ui/aceternity/glass-card";
import { ModernButton } from "@/components/ui/aceternity/modern-button";
import { Star, Quote, ChevronLeft, ChevronRight, Play, Award, TrendingUp } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    content: "TodoAI transformed how I approach goal setting. The AI planning is incredibly accurate and the daily tasks are perfectly tailored to my schedule. I've achieved more in 6 months than I did in the previous 2 years.",
    rating: 5,
    achievement: "Completed 3 major projects",
    video: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Entrepreneur",
    company: "StartupXYZ",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "Finally, a tool that breaks down complex goals into manageable daily actions. The progress tracking keeps me motivated and the AI recommendations are spot-on. My startup is growing faster than ever.",
    rating: 5,
    achievement: "Launched successful startup",
    video: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Student",
    company: "University",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "The progress tracking keeps me motivated. I've achieved more in 3 months than the past year. The AI understands my learning style and adapts perfectly to my schedule.",
    rating: 5,
    achievement: "Improved grades by 40%",
    video: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Software Engineer",
    company: "Google",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "TodoAI's AI planning is revolutionary. It breaks down complex technical goals into daily coding tasks that actually make sense. My skill development has accelerated dramatically.",
    rating: 5,
    achievement: "Promoted to Senior Engineer",
    video: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Marketing Director",
    company: "Fortune 500",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    content: "The goal tracking and analytics are incredible. I can see exactly how my daily actions contribute to larger objectives. It's like having a personal AI coach that never sleeps.",
    rating: 5,
    achievement: "Increased team productivity by 60%",
    video: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
  },
  {
    id: 6,
    name: "Alex Thompson",
    role: "Fitness Coach",
    company: "Self-Employed",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    content: "TodoAI helped me structure my fitness goals and business objectives. The daily planning is so detailed and the progress tracking keeps me accountable. My client results have improved significantly.",
    rating: 5,
    achievement: "Built successful fitness business",
    video: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop"
  }
];

const achievements = [
  { icon: Award, text: "10,000+ Goals Completed", value: "10,000+" },
  { icon: TrendingUp, text: "95% Success Rate", value: "95%" },
  { icon: Star, text: "4.9/5 User Rating", value: "4.9/5" },
  { icon: Play, text: "50+ Countries", value: "50+" }
];

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { amount: 0.1, once: true });

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
            `
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Loved by thousands of
            <br />
            <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              successful achievers
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            See how TodoAI is helping people around the world achieve their most ambitious goals.
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Testimonial Content */}
            <div>
              <GlassCard className="p-8" intensity="medium">
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{testimonials[currentTestimonial].name}</h3>
                    <p className="text-gray-400">{testimonials[currentTestimonial].role}, {testimonials[currentTestimonial].company}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-white/20 mb-4" />
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  "{testimonials[currentTestimonial].content}"
                </p>
                
                <div className="flex items-center gap-2 text-green-400">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">{testimonials[currentTestimonial].achievement}</span>
                </div>
              </GlassCard>
            </div>

            {/* Video/Image */}
            <div className="relative">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden"
              >
                <Image
                  src={testimonials[currentTestimonial].video}
                  alt={testimonials[currentTestimonial].name}
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ModernButton
                    variant="glass"
                    size="lg"
                    icon={<Play className="w-6 h-6" />}
                    className="w-16 h-16 rounded-full"
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <ModernButton
              variant="glass"
              size="md"
              icon={<ChevronLeft className="w-4 h-4" />}
              onClick={prevTestimonial}
            />
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial 
                      ? 'bg-white w-8' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            <ModernButton
              variant="glass"
              size="md"
              icon={<ChevronRight className="w-4 h-4" />}
              onClick={nextTestimonial}
            />
          </div>
        </motion.div>

        {/* All Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            What our users are saying
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <GlassCard className="p-6" intensity="low">
                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-white font-medium text-sm">{testimonial.name}</div>
                      <div className="text-gray-400 text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    "{testimonial.content.slice(0, 120)}..."
                  </p>
                  
                  <div className="flex items-center gap-1 text-green-400">
                    <Award className="w-3 h-3" />
                    <span className="text-xs">{testimonial.achievement}</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.0 + index * 0.1 }}
              className="text-center"
            >
              <GlassCard className="p-6" intensity="low">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-white/20 to-white/10 flex items-center justify-center">
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{achievement.value}</div>
                <div className="text-gray-400 text-sm">{achievement.text}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
