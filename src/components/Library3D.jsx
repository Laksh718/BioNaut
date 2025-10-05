import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Box,
  Sphere,
  Torus,
  Cylinder,
  Plane,
  Environment,
  Stars,
  Float,
  Sparkles,
  Cloud,
  Effects,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";

// Enhanced 3D Book component with advanced animations and effects
function Book({
  position,
  rotation,
  color,
  title,
  category,
  scale = 1,
  onClick,
  bookData,
}) {
  const meshRef = useRef();
  const glowRef = useRef();
  const particlesRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Create particle system for book effects
  const particles = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 30; i++) {
      positions.push([
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
      ]);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Enhanced rotation with easing
      meshRef.current.rotation.y += hovered ? 0.02 : 0.005;
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

      // Dynamic floating animation
      meshRef.current.position.y =
        position[1] +
        Math.sin(state.clock.elapsedTime + position[0]) * 0.2 +
        Math.cos(state.clock.elapsedTime * 0.7) * 0.1;

      // Smooth scaling with bounce effect
      const targetScale = hovered ? scale * 1.2 : scale;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );

      // Glow effect animation
      if (glowRef.current) {
        glowRef.current.scale.setScalar(hovered ? 1.5 : 1);
        glowRef.current.material.opacity = hovered ? 0.3 : 0.1;
      }

      // Particle animation
      if (particlesRef.current && hovered) {
        particlesRef.current.rotation.y += 0.01;
        particlesRef.current.rotation.x += 0.005;
      }
    }
  });

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 1000);
    if (onClick) onClick(title, category, bookData);
  };

  return (
    <group>
      {/* Main book with enhanced materials */}
      <Box
        ref={meshRef}
        position={position}
        rotation={rotation}
        args={[0.8, 1.2, 0.2]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.4}
          roughness={0.3}
          emissive={
            hovered
              ? new THREE.Color(color).multiplyScalar(0.2)
              : new THREE.Color(0x000000)
          }
        />

        {/* Book spine */}
        <Box position={[0, 0, -0.11]} args={[0.8, 1.2, 0.02]}>
          <meshStandardMaterial
            color={new THREE.Color(color).multiplyScalar(0.7)}
          />
        </Box>

        {/* Book pages */}
        <Box position={[0, 0, 0.11]} args={[0.75, 1.15, 0.01]}>
          <meshStandardMaterial color="#f8f9fa" />
        </Box>

        {/* Book title */}
        <Text
          position={[0, 0.2, 0.12]}
          fontSize={0.08}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.7}
        >
          {title}
        </Text>

        {/* Category */}
        <Text
          position={[0, -0.1, 0.12]}
          fontSize={0.04}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
        >
          {category}
        </Text>

        {/* Research count */}
        <Text
          position={[0, -0.3, 0.12]}
          fontSize={0.03}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          {bookData?.researchCount || 0} studies
        </Text>
      </Box>

      {/* Glow effect */}
      <Box ref={glowRef} position={position} args={[1.2, 1.6, 0.3]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Box>

      {/* Floating particles around book */}
      {hovered && (
        <group ref={particlesRef} position={position}>
          {particles.map((pos, index) => (
            <Sphere key={index} position={pos} args={[0.01]}>
              <meshBasicMaterial color={color} transparent opacity={0.6} />
            </Sphere>
          ))}
        </group>
      )}

      {/* Click effect */}
      {clicked && (
        <group position={position}>
          <Sphere args={[0.5]}>
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </Sphere>
        </group>
      )}

      {/* Info tooltip */}
      {hovered && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.08}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Click for details
        </Text>
      )}
    </group>
  );
}

// 3D Space DNA Helix component
function DNAHelix({ position, data }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.02;
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const helixPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 100; i++) {
      const t = i / 100;
      const x = Math.cos(t * Math.PI * 4) * 0.5;
      const y = t * 3 - 1.5;
      const z = Math.sin(t * Math.PI * 4) * 0.5;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, []);

  return (
    <group ref={groupRef} position={position}>
      {/* Central core */}
      <Cylinder args={[0.1, 0.1, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#00ffff" emissive="#004444" />
      </Cylinder>

      {/* DNA strands */}
      {helixPoints.map((point, index) => (
        <Sphere key={index} position={point} args={[0.05]}>
          <meshStandardMaterial
            color={index % 2 === 0 ? "#ff00ff" : "#00ff00"}
            emissive={index % 2 === 0 ? "#440044" : "#004400"}
          />
        </Sphere>
      ))}

      {/* Energy field around helix */}
      <Torus args={[1, 0.05, 8, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
      </Torus>

      <Text
        position={[0, 2, 0]}
        fontSize={0.2}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        Space DNA Research
      </Text>
    </group>
  );
}

// 3D Futuristic Space Station component
function SpaceStation({ position, researchData }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Main station body */}
      <Torus args={[1, 0.3, 8, 16]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          color="#00aaff"
          emissive="#002244"
          metalness={0.8}
          roughness={0.2}
        />
      </Torus>

      {/* Central core */}
      <Sphere args={[0.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffffff" emissive="#444444" />
      </Sphere>

      {/* Energy rings */}
      <Torus args={[1.2, 0.02, 8, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#00ffff" transparent opacity={0.6} />
      </Torus>
      <Torus args={[0.8, 0.02, 8, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#ff00ff" transparent opacity={0.4} />
      </Torus>

      {/* Research modules */}
      {researchData.map((item, index) => (
        <Box
          key={index}
          position={[
            Math.cos((index / researchData.length) * Math.PI * 2) * 1.5,
            0,
            Math.sin((index / researchData.length) * Math.PI * 2) * 1.5,
          ]}
          args={[0.3, 0.3, 0.3]}
        >
          <meshStandardMaterial
            color="#ffaa00"
            emissive="#442200"
            metalness={0.7}
            roughness={0.3}
          />
        </Box>
      ))}

      {/* Docking ports */}
      {Array.from({ length: 4 }).map((_, index) => (
        <Cylinder
          key={index}
          args={[0.1, 0.1, 0.2]}
          position={[
            Math.cos((index / 4) * Math.PI * 2) * 1.3,
            0,
            Math.sin((index / 4) * Math.PI * 2) * 1.3,
          ]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <meshStandardMaterial color="#666666" />
        </Cylinder>
      ))}

      <Text
        position={[0, 2, 0]}
        fontSize={0.2}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        Space Station Alpha
      </Text>
    </group>
  );
}

// 3D Futuristic Microscope component
function Microscope({ position, samples }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Microscope base */}
      <Cylinder args={[0.3, 0.3, 0.2]} position={[0, -0.5, 0]}>
        <meshStandardMaterial
          color="#1a1a1a"
          emissive="#111111"
          metalness={0.9}
          roughness={0.1}
        />
      </Cylinder>

      {/* Microscope arm */}
      <Cylinder
        args={[0.05, 0.05, 1]}
        position={[0, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshStandardMaterial
          color="#333333"
          emissive="#222222"
          metalness={0.8}
          roughness={0.2}
        />
      </Cylinder>

      {/* Holographic display */}
      <Box args={[0.4, 0.3, 0.05]} position={[0.6, 0.2, 0]}>
        <meshBasicMaterial color="#00ffff" transparent opacity={0.7} />
      </Box>

      {/* Sample slides with glow */}
      {samples.map((sample, index) => (
        <Box
          key={index}
          position={[0.6 + index * 0.2, 0, 0]}
          args={[0.15, 0.1, 0.05]}
        >
          <meshStandardMaterial
            color="#00ff00"
            emissive="#004400"
            metalness={0.6}
            roughness={0.4}
          />
        </Box>
      ))}

      {/* Laser scanning beam */}
      <Cylinder
        args={[0.01, 0.01, 0.8]}
        position={[0.3, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshBasicMaterial color="#ff0000" transparent opacity={0.8} />
      </Cylinder>

      <Text
        position={[0, 1, 0]}
        fontSize={0.15}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        Quantum Microscope
      </Text>
    </group>
  );
}

// Main 3D Scene
function Scene3D() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Professional color scheme
  const libraryData = {
    biology: [
      {
        title: "Cell Biology",
        category: "Biology",
        color: "#2d5a27",
        description:
          "Study of cellular structures and functions in space environments",
        researchCount: 45,
        keyFindings: [
          "3D cell growth patterns",
          "Protein synthesis changes",
          "Membrane behavior",
        ],
        applications: [
          "Cancer research",
          "Drug development",
          "Tissue engineering",
        ],
      },
      {
        title: "Genetics",
        category: "Biology",
        color: "#1e3a8a",
        description: "Genetic research in microgravity conditions",
        researchCount: 32,
        keyFindings: [
          "DNA damage patterns",
          "Gene expression changes",
          "Epigenetic modifications",
        ],
        applications: [
          "Radiation protection",
          "Genetic therapy",
          "Space medicine",
        ],
      },
      {
        title: "Microbiology",
        category: "Biology",
        color: "#166534",
        description: "Microbial behavior in space habitats",
        researchCount: 28,
        keyFindings: [
          "Increased virulence",
          "Biofilm formation",
          "Antibiotic resistance",
        ],
        applications: ["Infection control", "Bioremediation", "Food safety"],
      },
      {
        title: "Biochemistry",
        category: "Biology",
        color: "#1f2937",
        description: "Biochemical processes in zero gravity",
        researchCount: 41,
        keyFindings: [
          "Enzyme kinetics",
          "Protein folding",
          "Metabolic pathways",
        ],
        applications: ["Pharmaceuticals", "Biotechnology", "Materials science"],
      },
    ],
    space: [
      {
        title: "Astrobiology",
        category: "Space",
        color: "#1e40af",
        description: "Search for life beyond Earth",
        researchCount: 38,
        keyFindings: [
          "Extremophile survival",
          "Mars habitability",
          "Europa exploration",
        ],
        applications: [
          "Planetary protection",
          "Life detection",
          "Mission planning",
        ],
      },
      {
        title: "Space Medicine",
        category: "Space",
        color: "#7c2d12",
        description: "Medical research for space missions",
        researchCount: 52,
        keyFindings: [
          "Bone density loss",
          "Muscle atrophy",
          "Cardiovascular changes",
        ],
        applications: [
          "Countermeasures",
          "Rehabilitation",
          "Long-duration missions",
        ],
      },
      {
        title: "Planetary Science",
        category: "Space",
        color: "#374151",
        description: "Study of planetary systems and environments",
        researchCount: 67,
        keyFindings: [
          "Atmospheric composition",
          "Geological processes",
          "Planetary formation",
        ],
        applications: [
          "Mission design",
          "Resource utilization",
          "Climate modeling",
        ],
      },
      {
        title: "Space Technology",
        category: "Space",
        color: "#1f2937",
        description: "Advanced technologies for space exploration",
        researchCount: 43,
        keyFindings: ["Propulsion systems", "Life support", "Communication"],
        applications: [
          "Deep space missions",
          "Mars colonization",
          "Satellite technology",
        ],
      },
    ],
    research: [
      {
        title: "Microgravity",
        category: "Research",
        color: "#4b5563",
        description: "Effects of reduced gravity on biological systems",
        researchCount: 89,
        keyFindings: [
          "Fluid dynamics",
          "Crystal growth",
          "Combustion behavior",
        ],
        applications: [
          "Materials processing",
          "Drug development",
          "Manufacturing",
        ],
      },
      {
        title: "Radiation",
        category: "Research",
        color: "#6b7280",
        description: "Space radiation effects on living organisms",
        researchCount: 34,
        keyFindings: [
          "Radiation shielding",
          "DNA repair mechanisms",
          "Cancer risk assessment",
        ],
        applications: [
          "Radiation protection",
          "Medical imaging",
          "Nuclear safety",
        ],
      },
      {
        title: "Life Support",
        category: "Research",
        color: "#059669",
        description: "Life support systems for space missions",
        researchCount: 56,
        keyFindings: ["Air recycling", "Water purification", "Food production"],
        applications: ["Space stations", "Mars missions", "Sustainable living"],
      },
      {
        title: "Space Adaptation",
        category: "Research",
        color: "#7c3aed",
        description: "How organisms adapt to space environments",
        researchCount: 47,
        keyFindings: [
          "Physiological changes",
          "Psychological effects",
          "Recovery protocols",
        ],
        applications: [
          "Astronaut training",
          "Rehabilitation",
          "Performance optimization",
        ],
      },
    ],
  };

  // Fetch data from API
  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/recommendations");
      const data = await response.json();
      setApiData(data);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load API data on component mount
  React.useEffect(() => {
    fetchRecommendations();
  }, []);

  const researchData = [
    { name: "Microgravity Effects", count: 45 },
    { name: "Radiation Studies", count: 32 },
    { name: "Life Support Systems", count: 28 },
    { name: "Space Medicine", count: 41 },
  ];

  const samples = [
    { name: "Blood Sample", type: "Biological" },
    { name: "Tissue Sample", type: "Biological" },
    { name: "Microorganism", type: "Microbial" },
  ];

  const handleBookClick = (title, category, bookData) => {
    setSelectedBook(bookData);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedBook(null);
  };

  return (
    <div className="w-full h-full">
      {/* Category Filter */}
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">Categories</h3>
        <div className="space-y-2">
          {["all", "biology", "space", "research"].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced 3D Canvas with advanced lighting and effects */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{
          background:
            "radial-gradient(ellipse at center, #0a0a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)",
        }}
      >
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.3} color="#404040" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          color="#ffffff"
          castShadow
        />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.8}
          color="#00ffff"
        />
        <pointLight position={[0, 10, 0]} intensity={0.6} color="#ff00ff" />
        <pointLight position={[10, -5, 5]} intensity={0.4} color="#ffff00" />

        {/* Environment and atmosphere */}
        <Environment preset="night" />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* Floating clouds for atmosphere */}
        <Cloud
          position={[0, 5, -10]}
          speed={0.4}
          opacity={0.1}
          color="#ffffff"
        />
        <Cloud
          position={[-5, 3, -8]}
          speed={0.3}
          opacity={0.08}
          color="#cccccc"
        />

        {/* Enhanced stars background with twinkling */}
        {Array.from({ length: 300 }).map((_, index) => (
          <Float
            key={index}
            speed={0.5 + Math.random() * 2}
            rotationIntensity={0.1}
            floatIntensity={0.1}
          >
            <Sphere
              position={[
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 30,
              ]}
              args={[0.01 + Math.random() * 0.02]}
            >
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.6 + Math.random() * 0.4}
              />
            </Sphere>
          </Float>
        ))}

        {/* Sparkles effect */}
        <Sparkles count={100} scale={10} size={2} speed={0.4} color="#ffffff" />

        {/* Books floating around */}
        {selectedCategory === "all" || selectedCategory === "biology"
          ? libraryData.biology.map((book, index) => (
              <Book
                key={`bio-${index}`}
                position={[
                  Math.cos(index * 0.8) * 3,
                  Math.sin(index * 0.5) * 2,
                  Math.sin(index * 0.8) * 3,
                ]}
                rotation={[0, index * 0.5, 0]}
                color={book.color}
                title={book.title}
                category={book.category}
                bookData={book}
                onClick={handleBookClick}
              />
            ))
          : null}

        {selectedCategory === "all" || selectedCategory === "space"
          ? libraryData.space.map((book, index) => (
              <Book
                key={`space-${index}`}
                position={[
                  Math.cos(index * 0.8 + Math.PI) * 3,
                  Math.sin(index * 0.5) * 2,
                  Math.sin(index * 0.8 + Math.PI) * 3,
                ]}
                rotation={[0, index * 0.5 + Math.PI, 0]}
                color={book.color}
                title={book.title}
                category={book.category}
                bookData={book}
                onClick={handleBookClick}
              />
            ))
          : null}

        {selectedCategory === "all" || selectedCategory === "research"
          ? libraryData.research.map((book, index) => (
              <Book
                key={`research-${index}`}
                position={[
                  Math.cos(index * 0.8 + Math.PI * 1.5) * 3,
                  Math.sin(index * 0.5) * 2,
                  Math.sin(index * 0.8 + Math.PI * 1.5) * 3,
                ]}
                rotation={[0, index * 0.5 + Math.PI * 1.5, 0]}
                color={book.color}
                title={book.title}
                category={book.category}
                bookData={book}
                onClick={handleBookClick}
              />
            ))
          : null}

        {/* Central DNA Helix */}
        {selectedCategory === "biology" && (
          <DNAHelix position={[0, 0, 0]} data={researchData} />
        )}

        {/* Space Station */}
        {selectedCategory === "space" && (
          <SpaceStation position={[0, 0, 0]} researchData={researchData} />
        )}

        {/* Microscope */}
        {selectedCategory === "research" && (
          <Microscope position={[0, 0, 0]} samples={samples} />
        )}

        {/* Central floating particles */}
        {selectedCategory === "all" && (
          <>
            {Array.from({ length: 100 }).map((_, index) => (
              <Sphere
                key={index}
                position={[
                  (Math.random() - 0.5) * 15,
                  (Math.random() - 0.5) * 15,
                  (Math.random() - 0.5) * 15,
                ]}
                args={[0.02]}
              >
                <meshBasicMaterial
                  color={new THREE.Color().setHSL(Math.random(), 0.8, 0.7)}
                  transparent
                  opacity={0.8}
                />
              </Sphere>
            ))}
          </>
        )}

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>

      {/* Professional Book Details Modal */}
      {showDetails && selectedBook && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-2xl mx-4 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedBook.color }}
                ></div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedBook.title}
                </h3>
              </div>
              <button
                onClick={closeDetails}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Description */}
              <p className="text-gray-700 text-base leading-relaxed">
                {selectedBook.description}
              </p>

              {/* Research Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-gray-900 font-semibold mb-2">
                  Research Statistics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedBook.researchCount}
                    </div>
                    <div className="text-sm text-gray-600">
                      Published Studies
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {selectedBook.category}
                    </div>
                    <div className="text-sm text-gray-600">Research Field</div>
                  </div>
                </div>
              </div>

              {/* Key Findings */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-blue-900 font-semibold mb-3">
                  Key Research Findings
                </h4>
                <ul className="space-y-1">
                  {selectedBook.keyFindings.map((finding, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-blue-800">{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Applications */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-green-900 font-semibold mb-3">
                  Practical Applications
                </h4>
                <ul className="space-y-1">
                  {selectedBook.applications.map((app, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-green-800">{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Professional Info Panel */}
      <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg p-4 max-w-sm shadow-lg border">
        <h3 className="text-gray-900 font-semibold mb-3 text-lg">
          Research Library
        </h3>
        <div className="text-gray-600 text-sm space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600">•</span>
            <span>Click books for research details</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">•</span>
            <span>Hover for quick preview</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-600">•</span>
            <span>Use mouse to navigate 3D space</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-orange-600">•</span>
            <span>Filter by research category</span>
          </div>
        </div>

        {/* Research Statistics */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h4 className="text-gray-900 font-semibold mb-2">
            Research Statistics
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-50 rounded p-2">
              <div className="text-blue-600 font-bold">12</div>
              <div className="text-blue-800">Research Areas</div>
            </div>
            <div className="bg-green-50 rounded p-2">
              <div className="text-green-600 font-bold">500+</div>
              <div className="text-green-800">Studies</div>
            </div>
            <div className="bg-purple-50 rounded p-2">
              <div className="text-purple-600 font-bold">3</div>
              <div className="text-purple-800">Categories</div>
            </div>
            <div className="bg-orange-50 rounded p-2">
              <div className="text-orange-600 font-bold">Live</div>
              <div className="text-orange-800">API Data</div>
            </div>
          </div>
        </div>

        {/* API Status */}
        {isLoading && (
          <div className="mt-3 text-sm text-blue-600">
            Loading research data...
          </div>
        )}
        {apiData && (
          <div className="mt-3 text-sm text-green-600">
            API data loaded successfully
          </div>
        )}
      </div>
    </div>
  );
}

export default Scene3D;
