import React from "react";
import { Star, ShieldCheck, Quote, CheckCircle2 } from "lucide-react";

interface ReviewItem {
  id: string;
  name: string;
  location: string;
  productName: string;
  rating: number;
  date: string;
  comment: string;
}

const reviews: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Tanvir Ahmed",
    location: "Chittagong",
    productName: "ChatGPT Plus (1 Month)",
    rating: 5,
    date: "2 days ago",
    comment:
      "Ordered ChatGPT Plus using bKash payment. Within 10 minutes I received access credentials in my account dashboard. Fast and authentic!",
  },
  {
    id: "rev-2",
    name: "Mahfuzur Rahman",
    location: "Dhaka",
    productName: "Adobe Photoshop (1 Year)",
    rating: 5,
    date: "1 week ago",
    comment:
      "Genuine Adobe subscription activated directly with my email. Excellent support from their team via WhatsApp.",
  },
  {
    id: "rev-3",
    name: "Jobair Hosen",
    location: "Chittagong",
    productName: "Online Course Bundle (Lifetime)",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "The course curriculum and digital marketing resources are top quality. Very easy learning path for freelancers in Bangladesh.",
  },
  {
    id: "rev-4",
    name: "Nusrat Jahan",
    location: "Sylhet",
    productName: "Digital Marketing Package",
    rating: 5,
    date: "3 weeks ago",
    comment:
      "Their team set up targeted Facebook and Google ad campaigns for our brand. Inquiries increased significantly within days.",
  },
];

export function CustomerReviewsSection() {
  return (
    <section className="py-16 bg-[#070B16] border-t border-[#1B2A45]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Customer Reviews</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
            What Our Bangladeshi Clients Say
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Genuine feedback from verified professionals, creators, and students using DigitalHub.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl bg-[#0B1224] border border-[#1B2A45] p-5 flex flex-col justify-between space-y-4 hover:border-[#00D9FF]/40 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,217,255,0.1)]"
            >
              <div className="space-y-3">
                {/* Rating Stars & Quote */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-4 h-4 text-[#1B2A45]" />
                </div>

                {/* Comment */}
                <p className="text-xs text-[#94A3B8] leading-relaxed italic">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-3 border-t border-[#1B2A45]/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#F8FAFC]">{r.name}</span>
                    <span title="Verified Buyer" className="inline-flex items-center">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </span>
                  </div>
                  <span className="text-[10px] text-[#00D9FF] block">
                    {r.productName} • {r.location}
                  </span>
                </div>
                <span className="text-[10px] text-[#94A3B8]/60">{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
