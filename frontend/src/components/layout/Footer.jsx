import { FaFacebookF, FaInstagram, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { IoMdBicycle } from "react-icons/io";

function Footer() {
    return (
        <footer className="w-full bg-[#172B4D] text-[#ffffff] font-akagi">
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <IoMdBicycle className="text-4xl text-yellow" />
                            <h2 className="text-2xl font-bold">
                                3Jremy's Rent A Bike!
                            </h2>
                        </div>

                        <p className="text-white/70 text-sm leading-relaxed max-w-xs">
                            Make every ride memorable. Explore La Mesa Eco Park
                            and enjoy a fun, relaxing biking experience with us.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-yellow">
                            Quick Links
                        </h3>

                        <div className="flex flex-col gap-2 text-sm text-white/70">
                            <a href="" className="hover:text-yellow transition">Home</a>
                            <a href="reserve" className="hover:text-yellow transition">Reserve</a>
                            <a href="transactions" className="hover:text-yellow transition">Transactions</a>
                            <a href="reviews" className="hover:text-yellow transition">Reviews</a>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-yellow">
                            Visit Us
                        </h3>

                        <div className="flex items-start gap-3 text-sm text-white/70">
                            <FaMapMarkerAlt className="text-yellow text-lg mt-1 shrink-0" />
                            <p>
                                La Mesa Eco Park,<br />
                                Quezon City, Philippines
                            </p>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-yellow">
                            Get In Touch
                        </h3>

                        <div className="flex items-center gap-3 text-sm text-white/70">
                            <FaPhoneAlt className="text-yellow" />
                            <span>0957 274 9275</span>
                        </div>

                        <div className="flex gap-3">
                            <a
                                href="https://www.facebook.com/profile.php?id=61572482742286"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow hover:text-blue transition"
                            >
                                <FaFacebookF />
                            </a>

                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-yellow hover:text-blue transition"
                            >
                                <FaInstagram />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/15 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-center text-sm text-white/50">
                    <p>
                        © {new Date().getFullYear()} 3Jremy's Rent A Bike. All rights reserved.
                    </p>

                    <p>
                        Made for your next adventure.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer