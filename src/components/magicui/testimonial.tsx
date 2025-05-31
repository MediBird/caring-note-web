import { cn } from '@/lib/utils';
import { Marquee } from '@/components/magicui/marquee';

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        'bg-cyan-600/20 p-1 py-0.5 font-bold text-cyan-600 dark:bg-cyan-600/20 dark:text-cyan-600',
        className,
      )}>
      {children}
    </span>
  );
};

export interface TestimonialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role: string;
  description: React.ReactNode;
  className?: string;
}

export const TestimonialCard = ({
  description,
  name,
  role,
  className,
  ...props // Capture the rest of the props
}: TestimonialCardProps) => (
  <div
    className={cn(
      'mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-[0.625rem] rounded-xl p-3',
      // light styles
      'border border-neutral-200 bg-primary-5',
      // dark styles
      'dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
      className,
    )}
    {...props} // Spread the rest of the props here
  >
    <div className="select-none break-keep text-body1 font-normal text-grayscale-80">
      {description}
    </div>

    <div className="flex w-full select-none items-center justify-center">
      <div>
        <p className="text-body1font-medium text-grayscale-50">- {name}</p>
        {role && <p className="text-xs font-normal text-neutral-400">{role}</p>}
      </div>
    </div>
  </div>
);

export interface SocialProofTestimonialsProps {
  title?: string;
  testimonials?: Array<{
    name: string;
    role: string;
    img?: string;
    description: React.ReactNode;
  }>;
  className?: string;
  maxHeight?: string;
  columns?: number;
  vertical?: boolean;
}

export function SocialProofTestimonials({
  testimonials: customTestimonials,
  className,
  maxHeight = '650px',
  columns = 4,
  vertical = true,
}: SocialProofTestimonialsProps = {}) {
  const defaultTestimonials = [
    {
      name: 'Alex Rivera',
      role: 'CTO at InnovateTech',
      img: 'https://randomuser.me/api/portraits/men/91.jpg',
      description: (
        <p>
          The AI-driven analytics from #QuantumInsights have revolutionized our
          product development cycle.
          <Highlight>
            Insights are now more accurate and faster than ever.
          </Highlight>{' '}
          A game-changer for tech companies.
        </p>
      ),
    },
    {
      name: 'Samantha Lee',
      role: 'Marketing Director at NextGen Solutions',
      img: 'https://randomuser.me/api/portraits/women/12.jpg',
      description: (
        <p>
          Implementing #AIStream's customer prediction model has drastically
          improved our targeting strategy.
          <Highlight>Seeing a 50% increase in conversion rates!</Highlight>{' '}
          Highly recommend their solutions.
        </p>
      ),
    },
    {
      name: 'Raj Patel',
      role: 'Founder & CEO at StartUp Grid',
      img: 'https://randomuser.me/api/portraits/men/45.jpg',
      description: (
        <p>
          As a startup, we need to move fast and stay ahead. #CodeAI's automated
          coding assistant helps us do just that.
          <Highlight>Our development speed has doubled.</Highlight> Essential
          tool for any startup.
        </p>
      ),
    },
    {
      name: 'Emily Chen',
      role: 'Product Manager at Digital Wave',
      img: 'https://randomuser.me/api/portraits/women/83.jpg',
      description: (
        <p>
          #VoiceGen's AI-driven voice synthesis has made creating global
          products a breeze.
          <Highlight>Localization is now seamless and efficient.</Highlight> A
          must-have for global product teams.
        </p>
      ),
    },
    {
      name: 'Michael Brown',
      role: 'Data Scientist at FinTech Innovations',
      img: 'https://randomuser.me/api/portraits/men/1.jpg',
      description: (
        <p>
          Leveraging #DataCrunch's AI for our financial models has given us an
          edge in predictive accuracy.
          <Highlight>
            Our investment strategies are now powered by real-time data
            analytics.
          </Highlight>{' '}
          Transformative for the finance industry.
        </p>
      ),
    },
    {
      name: 'Linda Wu',
      role: 'VP of Operations at LogiChain Solutions',
      img: 'https://randomuser.me/api/portraits/women/5.jpg',
      description: (
        <p>
          #LogiTech's supply chain optimization tools have drastically reduced
          our operational costs.
          <Highlight>
            Efficiency and accuracy in logistics have never been better.
          </Highlight>{' '}
        </p>
      ),
    },
    {
      name: 'Carlos Gomez',
      role: 'Head of R&D at EcoInnovate',
      img: 'https://randomuser.me/api/portraits/men/14.jpg',
      description: (
        <p>
          By integrating #GreenTech's sustainable energy solutions, we've seen a
          significant reduction in carbon footprint.
          <Highlight>
            Leading the way in eco-friendly business practices.
          </Highlight>{' '}
          Pioneering change in the industry.
        </p>
      ),
    },
    {
      name: 'Aisha Khan',
      role: 'Chief Marketing Officer at Fashion Forward',
      img: 'https://randomuser.me/api/portraits/women/56.jpg',
      description: (
        <p>
          #TrendSetter's market analysis AI has transformed how we approach
          fashion trends.
          <Highlight>
            Our campaigns are now data-driven with higher customer engagement.
          </Highlight>{' '}
          Revolutionizing fashion marketing.
        </p>
      ),
    },
    {
      name: 'Tom Chen',
      role: 'Director of IT at HealthTech Solutions',
      img: 'https://randomuser.me/api/portraits/men/18.jpg',
      description: (
        <p>
          Implementing #MediCareAI in our patient care systems has improved
          patient outcomes significantly.
          <Highlight>
            Technology and healthcare working hand in hand for better health.
          </Highlight>{' '}
          A milestone in medical technology.
        </p>
      ),
    },
    {
      name: 'Sofia Patel',
      role: 'CEO at EduTech Innovations',
      img: 'https://randomuser.me/api/portraits/women/73.jpg',
      description: (
        <p>
          #LearnSmart's AI-driven personalized learning plans have doubled
          student performance metrics.
          <Highlight>
            Education tailored to every learner's needs.
          </Highlight>{' '}
          Transforming the educational landscape.
        </p>
      ),
    },
    {
      name: 'Jake Morrison',
      role: 'CTO at SecureNet Tech',
      img: 'https://randomuser.me/api/portraits/men/25.jpg',
      description: (
        <p>
          With #CyberShield's AI-powered security systems, our data protection
          levels are unmatched.
          <Highlight>
            Ensuring safety and trust in digital spaces.
          </Highlight>{' '}
          Redefining cybersecurity standards.
        </p>
      ),
    },
    {
      name: 'Nadia Ali',
      role: 'Product Manager at Creative Solutions',
      img: 'https://randomuser.me/api/portraits/women/78.jpg',
      description: (
        <p>
          #DesignPro's AI has streamlined our creative process, enhancing
          productivity and innovation.
          <Highlight>Bringing creativity and technology together.</Highlight> A
          game-changer for creative industries.
        </p>
      ),
    },
    {
      name: 'Omar Farooq',
      role: 'Founder at Startup Hub',
      img: 'https://randomuser.me/api/portraits/men/54.jpg',
      description: (
        <p>
          #VentureAI's insights into startup ecosystems have been invaluable for
          our growth and funding strategies.
          <Highlight>
            Empowering startups with data-driven decisions.
          </Highlight>{' '}
          A catalyst for startup success.
        </p>
      ),
    },
  ];

  const testimonials = customTestimonials || defaultTestimonials;

  return (
    <section id="testimonials" className={className}>
      <div className="py-[0.75rem]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="relative overflow-hidden" style={{ maxHeight }}>
            <div
              className={`gap-4 ${
                columns === 1
                  ? 'columns-1'
                  : columns === 2
                    ? 'md:columns-2'
                    : columns === 3
                      ? 'md:columns-2 xl:columns-3'
                      : 'md:columns-2 xl:columns-3 2xl:columns-4'
              }`}>
              {Array(columns)
                .fill(0)
                .map((_, i) => {
                  const columnTestimonials = testimonials.filter(
                    (_, index) => index % columns === i,
                  );
                  return (
                    <Marquee
                      vertical={vertical}
                      key={i}
                      className={cn({
                        '[--duration:30s]': i === 0,
                        '[--duration:40s]': i === 1,
                        '[--duration:35s]': i === 2,
                        '[--duration:45s]': i === 3,
                      })}
                      reverse={i % 2 === 1}>
                      {columnTestimonials.map((card, idx) => (
                        <TestimonialCard {...card} key={`${i}-${idx}`} />
                      ))}
                    </Marquee>
                  );
                })}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-white from-20% dark:from-black"></div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-white from-20% dark:from-black"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
