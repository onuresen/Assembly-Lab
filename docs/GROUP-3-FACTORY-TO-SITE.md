# Group 3: Factory-to-Site Flow

The Factory-to-Site journey turns the active product system into one continuous delivery story:

1. parts are grouped into small production batches by family;
2. parts are packed into truck loads under the weight limit;
3. transport width, lifting weight and long lead-time constraints are surfaced;
4. every part moves through factory, truck, site buffer and installed stages;
5. the active delivery step selects the same part in the 3D model.

The journey is derived rather than persisted. It reuses authored requirements and selected variants, and its timer updates only the interface; it does not keep the WebGL render loop continuously active.
