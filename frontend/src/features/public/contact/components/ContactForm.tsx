"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { publicContactSchema, PublicContactFormValues } from '../schemas/contact.schema';
import { submitContactMessage } from '../api/submit-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PublicContactFormValues>({
    resolver: zodResolver(publicContactSchema),
  });

  const mutation = useMutation({
    mutationFn: submitContactMessage,
    onSuccess: () => {
      setIsSuccess(true);
      reset();
      toast.success('Message sent successfully! I will get back to you soon.');
      
      // Reset success state after a few seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    },
    onError: (error: unknown) => {
      // @ts-expect-error -- error is typed as unknown; response is an axios shape
      toast.error(error.response?.data?.title || 'Failed to send message. Please try again.');
    },
  });

  const onSubmit = (data: PublicContactFormValues) => {
    mutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-primary/10 border border-primary/20">
        <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
        <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
        <p className="text-muted-foreground">
          Thank you for reaching out. I&apos;ve received your message and will get back to you as soon as possible.
        </p>
        <Button 
          variant="outline" 
          className="mt-6" 
          onClick={() => setIsSuccess(false)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <Input 
            id="name" 
            placeholder="Pham Duc Thuy" 
            {...register('name')} 
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input 
            id="email" 
            type="email" 
            placeholder="example@example.com" 
            {...register('email')} 
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">Subject</label>
        <Input 
          id="subject" 
          placeholder="How can I help you?" 
          {...register('subject')} 
          className={errors.subject ? 'border-destructive' : ''}
        />
        {errors.subject && (
          <p className="text-xs text-destructive">{errors.subject.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="content" className="text-sm font-medium">Message</label>
        <Textarea 
          id="content" 
          placeholder="Tell me about your project..." 
          rows={6}
          {...register('content')} 
          className={errors.content ? 'border-destructive' : ''}
        />
        {errors.content && (
          <p className="text-xs text-destructive">{errors.content.message}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full sm:w-auto" 
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" /> Send Message
          </>
        )}
      </Button>
    </form>
  );
}
