import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    category: "General",
    questions: [
      {
        question: "What is LabourMandi?",
        answer: "LabourMandi is India's leading construction marketplace that connects skilled workers with clients. You can find professionals for construction, plumbing, electrical work, painting, and many other services. You can also buy, sell, or rent construction materials and equipment.",
      },
      {
        question: "How do I get started?",
        answer: "Simply sign in with your Google account. Once logged in, you can post jobs, browse professionals, or register as a service provider. The process takes just a few minutes!",
      },
      {
        question: "Is LabourMandi free to use?",
        answer: "Creating an account and browsing is free. We offer a 15-day trial for premium features. After the trial, you can continue with basic features or subscribe to a premium plan for advanced features like priority listings and unlimited bids.",
      },
    ],
  },
  {
    category: "For Clients",
    questions: [
      {
        question: "How do I hire a professional?",
        answer: "Post your job with details about the work required, budget, and location. Verified professionals will submit bids. You can review their profiles, ratings, and portfolios, then accept the best bid. The professional will then contact you to complete the work.",
      },
      {
        question: "How do I know if a professional is reliable?",
        answer: "All professionals on LabourMandi undergo KYC verification. You can also check their ratings, reviews from previous clients, completed job count, and portfolio. We recommend hiring professionals with verified badges and high ratings.",
      },
      {
        question: "What if I'm not satisfied with the work?",
        answer: "We encourage open communication between clients and professionals. If issues arise, you can contact our support team. For escrow payments, funds are released only after you confirm satisfaction with the work.",
      },
    ],
  },
  {
    category: "For Professionals",
    questions: [
      {
        question: "How do I register as a professional?",
        answer: "Sign in with your Google account, then go to your profile settings and select 'Register as Professional'. Complete your profile with your skills, experience, portfolio, and rates. You'll need to complete KYC verification to start receiving jobs.",
      },
      {
        question: "What is KYC verification?",
        answer: "Know Your Customer (KYC) verification involves uploading identity documents like Aadhaar card, PAN card, or other government-issued ID. This builds trust with clients and is required to accept jobs on the platform.",
      },
      {
        question: "How do I get more jobs?",
        answer: "Complete your profile with detailed information and quality portfolio images. Maintain high ratings by delivering quality work. Respond quickly to job posts and submit competitive bids. Regular activity on the platform also improves your visibility.",
      },
    ],
  },
  {
    category: "Payments & Wallet",
    questions: [
      {
        question: "How does the wallet work?",
        answer: "The LabourMandi wallet is a secure way to manage payments. Clients can add funds to their wallet, which can be used to pay for services. Professionals receive payments directly to their wallet, which can be withdrawn to their bank account.",
      },
      {
        question: "What payment methods are accepted?",
        answer: "We accept all major payment methods through Razorpay including credit/debit cards, UPI, net banking, and popular wallets like Paytm and PhonePe.",
      },
      {
        question: "Is my payment information secure?",
        answer: "Yes, all payments are processed through Razorpay, a PCI-DSS compliant payment gateway. We never store your card details on our servers.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about using LabourMandi
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <a href="/contact" className="text-primary hover:underline">
              Contact Support
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
